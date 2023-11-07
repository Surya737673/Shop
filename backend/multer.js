const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req,res,cb){
        cb(null, path.join(__dirname, './uploads'));
    },
    filename: function (req,file,cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = file.originalname.split(".")[0];
        cb(null,filename + "-" + uniqueSuffix + ".png");
    },
});

const pdfStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'pdf'); // Set the destination folder to "pdf"
    },
    filename: function (req, file, cb) {
      const orderId = req.params.id;
      const filename = `order${orderId}.pdf`;
      cb(null, filename); // Set the filename to "order{orderId}.pdf"
    },
  });

exports.upload = multer({storage: storage});
exports.uploadPdf = multer({storage: pdfStorage});

