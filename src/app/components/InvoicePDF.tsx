import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Invoice } from '@prisma/client';

const colors = {
  black: '#000000',
  gray500: '#6b7280',
  gray200: '#e5e7eb',
  gray100: '#f3f4f6',
  indigo600: '#4f46e5',
  purple400: '#a78bfa',
  white: '#ffffff',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    backgroundColor: colors.white,
    color: colors.black,
  },
  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black,
  },
  invoiceNumber: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 9,
    fontWeight: 'bold',
  },
  // Two-column info
  infoRow: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  infoCol: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  infoName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 3,
  },
  infoText: {
    fontSize: 10,
    color: colors.gray500,
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 10,
    color: colors.gray500,
  },
  detailValue: {
    fontSize: 10,
    color: colors.black,
  },
  // Divider
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    marginBottom: 16,
  },
  // Table
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    paddingBottom: 8,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    paddingVertical: 8,
  },
  colDesc: { width: '40%' },
  colQty: { width: '15%', textAlign: 'right' },
  colPrice: { width: '20%', textAlign: 'right' },
  colTotal: { width: '25%', textAlign: 'right' },
  thText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.gray500,
  },
  tdText: {
    fontSize: 10,
    color: colors.gray500,
  },
  tdTextBold: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.black,
  },
  // Grand total
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: colors.gray200,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.black,
    marginRight: 20,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.purple400,
  },
});

function getStatusStyle(status: string) {
  switch (status) {
    case 'PAID':
      return { backgroundColor: '#dcfce7', color: '#15803d' };
    case 'SENT':
      return { backgroundColor: '#fef9c3', color: '#a16207' };
    default:
      return { backgroundColor: colors.gray100, color: colors.gray500 };
  }
}

interface InvoicePDFProps {
  invoice: Invoice;
}

const InvoicePDF = ({ invoice }: InvoicePDFProps) => {
    const raw = typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items;
    const items = raw as { description: string; quantity: number; price: number }[];
    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
    const statusStyle = getStatusStyle(invoice.status);

    return (
        <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>INVOICE</Text>
                    <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
                </View>
                <View style={{...styles.statusBadge, backgroundColor: statusStyle.backgroundColor, color: statusStyle.color}}>
                    <Text>{invoice.status}</Text>
                </View>
            </View>

            {/* Two-column info: Billed To + Invoice Details */}
            <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                    <Text style={styles.sectionLabel}>Billed To</Text>
                    <Text style={styles.infoName}>{invoice.clientName}</Text>
                    <Text style={styles.infoText}>{invoice.clientAddress}</Text>
                    <Text style={styles.infoText}>{invoice.clientEmail}</Text>
                </View>
                <View style={styles.infoCol}>
                    <Text style={styles.sectionLabel}>Invoice Details</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Issue Date:</Text>
                        <Text style={styles.detailValue}>{new Date(invoice.issueDate).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Due Date:</Text>
                        <Text style={styles.detailValue}>{new Date(invoice.dueDate).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Total:</Text>
                        <Text style={{...styles.detailValue, fontWeight: 'bold'}}>{fmt(invoice.totalAmount)}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Table Header */}
            <View style={styles.tableHeader}>
                <View style={styles.colDesc}><Text style={styles.thText}>Description</Text></View>
                <View style={styles.colQty}><Text style={{...styles.thText, textAlign: 'right'}}>Qty</Text></View>
                <View style={styles.colPrice}><Text style={{...styles.thText, textAlign: 'right'}}>Price</Text></View>
                <View style={styles.colTotal}><Text style={{...styles.thText, textAlign: 'right'}}>Total</Text></View>
            </View>

            {/* Table Rows */}
            {items.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                    <View style={styles.colDesc}><Text style={styles.tdText}>{item.description}</Text></View>
                    <View style={styles.colQty}><Text style={{...styles.tdText, textAlign: 'right'}}>{item.quantity}</Text></View>
                    <View style={styles.colPrice}><Text style={{...styles.tdText, textAlign: 'right'}}>{fmt(item.price)}</Text></View>
                    <View style={styles.colTotal}><Text style={{...styles.tdTextBold, textAlign: 'right'}}>{fmt(item.quantity * item.price)}</Text></View>
                </View>
            ))}

            {/* Grand Total */}
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>{fmt(invoice.totalAmount)}</Text>
            </View>
        </Page>
        </Document>
    );
};

export default InvoicePDF;
