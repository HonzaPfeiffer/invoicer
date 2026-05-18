export interface AresCompany {
  ico: string;
  name: string;
  address: string;
  street?: string;
  city?: string;
  zipCode?: string;
}

export async function searchCompaniesByName(query: string): Promise<AresCompany[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/vyhledat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          obchodniJmeno: query,
          start: 0,
          pocet: 10,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('ARES API request failed');
    }

    const data = await response.json();
    
    if (!data.ekonomickeSubjekty || data.ekonomickeSubjekty.length === 0) {
      return [];
    }

    return data.ekonomickeSubjekty.map((subject: any) => {
      const sidlo = subject.sidlo;
      const address = formatAddress(sidlo);
      
      return {
        ico: subject.ico,
        name: subject.obchodniJmeno,
        address,
        street: sidlo?.textovaAdresa || '',
        city: sidlo?.nazevObce || '',
        zipCode: sidlo?.psc ? String(sidlo.psc) : '',
      };
    });
  } catch (error) {
    console.error('Error searching companies:', error);
    return [];
  }
}

export async function searchCompaniesByIco(ico: string): Promise<AresCompany | null> {
  if (!ico || ico.length < 8) {
    return null;
  }

  try {
    const response = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const sidlo = data.sidlo;
    const address = formatAddress(sidlo);

    return {
      ico: data.ico,
      name: data.obchodniJmeno,
      address,
      street: sidlo?.textovaAdresa || '',
      city: sidlo?.nazevObce || '',
      zipCode: sidlo?.psc ? String(sidlo.psc) : '',
    };
  } catch (error) {
    console.error('Error fetching company by IČO:', error);
    return null;
  }
}

function formatAddress(sidlo: any): string {
  if (!sidlo) return '';
  
  const parts: string[] = [];
  
  if (sidlo.textovaAdresa) {
    parts.push(sidlo.textovaAdresa);
  }
  
  if (sidlo.nazevObce) {
    const cityPart = sidlo.psc 
      ? `${sidlo.psc} ${sidlo.nazevObce}`
      : sidlo.nazevObce;
    parts.push(cityPart);
  }
  
  return parts.join(', ');
}
