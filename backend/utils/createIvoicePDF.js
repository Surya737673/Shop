const fs = require('fs');
const PDFDocument = require('pdfkit');

function createInvoice(invoice, path) {

	let doc = new PDFDocument({ margin: 50 });

	generateHeader(doc); 
	generateFooter(doc); 

    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice)

	doc.end();
	doc.pipe(fs.createWriteStream(path));
}



function generateCustomerInformation(doc, invoice) {
	const shipping = invoice.shippingAddress;

	doc.text(`Invoice Number: ${invoice._id}`, 50, 200)
		.text(`Invoice Date: ${new Date()}`, 50, 215)
		.text(`Amount Paid: ${invoice.totalPrice}`, 50, 130)
		.text(
			`${shipping.city} , ${shipping.country}`,
			300,
			130,
		)
		.moveDown();
}

function generateInvoiceTable(doc, invoice) {
	let i,
		invoiceTableTop = 330;

	for (i = 0; i < invoice.cart.length; i++) {
		const cartItem = invoice.cart[i];
		const position = invoiceTableTop + (i + 1) * 30;
		generateTableRow(
			doc,
			position,
			cartItem.name,
			cartItem.description,
			cartItem.discountPrice / cartItem.qty,
			cartItem.quantity,
			cartItem.discountPrice,
		);
	}
}

function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
	doc.fontSize(10)
		.text(c1, 50, y)
		.text(c2, 150, y)
		.text(c3, 280, y, { width: 90, align: 'right' })
		.text(c4, 370, y, { width: 90, align: 'right' })
		.text(c5, 0, y, { align: 'right' });
}

function generateHeader(doc) {
	doc.image(`./uploads/Adidas-Cotton-Polo-1685254701409-495612662.png`, 50, 45, { width: 50 })
		.fillColor('#444444')
		.fontSize(20)
		.text('ACME Inc.', 110, 57)
		.fontSize(10)
		.text('123 Main Street', 200, 65, { align: 'right' })
		.text('New York, NY, 10025', 200, 80, { align: 'right' })
		.moveDown();
}

function generateFooter(doc) {
	doc.fontSize(
		10,
	).text(
		'Payment is due within 15 days. Thank you for your business.',
		50,
		780,
		{ align: 'center', width: 500 },
	);
	
}



module.exports = {
	createInvoice,
};