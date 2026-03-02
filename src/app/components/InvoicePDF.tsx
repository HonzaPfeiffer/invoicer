import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Invoice } from '@prisma/client';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 30,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  billedTo: {
    marginTop: 20,
    marginBottom: 20,
  },
  table: { 
    display: "flex", 
    width: "auto", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0 
  },
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  },
  tableColHeader: { 
    width: "25%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    backgroundColor: '#E4E4E4',
    padding: 5,
    fontWeight: 'bold',
  },
  tableCol: { 
    width: "25%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    padding: 5,
  },
  tableCell: {
    margin: "auto", 
    marginTop: 5, 
    fontSize: 10 
  },
  total: {
    textAlign: 'right',
    marginTop: 20,
    fontSize: 14,
    fontWeight: 'bold',
  }
});

interface InvoicePDFProps {
  invoice: Invoice;
}

const InvoicePDF = ({ invoice }: InvoicePDFProps) => {
    const raw = typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items;
    const items = raw as { description: string; quantity: number; price: number }[];
    return (
        <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.headerText}>INVOICE</Text>
                <Text>{invoice.invoiceNumber}</Text>
            </View>

            <View style={styles.billedTo}>
                <Text style={{fontWeight: 'bold'}}>Billed To:</Text>
                <Text>{invoice.clientName}</Text>
                <Text>{invoice.clientAddress}</Text>
                <Text>{invoice.clientEmail}</Text>
            </View>
            
            <View style={styles.section}>
                <Text><Text style={{fontWeight: 'bold'}}>Issue Date:</Text> {new Date(invoice.issueDate).toLocaleDateString()}</Text>
                <Text><Text style={{fontWeight: 'bold'}}>Due Date:</Text> {new Date(invoice.dueDate).toLocaleDateString()}</Text>
            </View>

            <View style={styles.table}> 
                <View style={styles.tableRow}> 
                    <View style={{...styles.tableColHeader, width: '40%'}}><Text style={styles.tableCell}>Description</Text></View> 
                    <View style={styles.tableColHeader}><Text style={styles.tableCell}>Quantity</Text></View>
                    <View style={styles.tableColHeader}><Text style={styles.tableCell}>Price</Text></View>
                    <View style={styles.tableColHeader}><Text style={styles.tableCell}>Total</Text></View>
                </View>
                {items.map((item, index) => (
                    <View style={styles.tableRow} key={index}>
                        <View style={{...styles.tableCol, width: '40%'}}><Text style={styles.tableCell}>{item.description}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{item.quantity}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>${item.price.toFixed(2)}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>${(item.quantity * item.price).toFixed(2)}</Text></View>
                    </View>
                ))}
            </View>

            <Text style={styles.total}>Total: ${invoice.totalAmount.toFixed(2)}</Text>
        </Page>
        </Document>
    );
};

export default InvoicePDF;
