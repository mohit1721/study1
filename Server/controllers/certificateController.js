
// // ----
// const path = require('path');
// const fs = require('fs');
// const PDFDocument = require('pdfkit');
// const Course = require('../models/Course');  // Adjust path if necessary

// exports.generateCertificate = async (req, res) => {
//   const { userName, courseName, issueDate, userId, courseId } = req.body;

//   if (!userName || !courseName || !issueDate || !userId || !courseId) {
//     return res.status(400).json({ message: "Missing userName, courseName, issueDate, userId, or courseId" });
//   }
//    // Fetch the course by ID and populate the instructor's details (firstName and lastName)
//    const course = await Course.findById(courseId).populate('instructor', 'firstName lastName');  // Populating the instructor field

//    if (!course) {
//      return res.status(404).json({ success: false, message: "Course not found" });
//    }

//    // Get the instructor's full name
//    const instructorName = `${course.instructor.firstName} ${course.instructor.lastName}`;

// // Directory for certificates
// const certificatesDir = path.join(__dirname, "../certificates");
// if (!fs.existsSync(certificatesDir)) {
//   fs.mkdirSync(certificatesDir, { recursive: true });
// }
//   const certificateFileName = `${userName.replace(/ /g, "_")}_${courseName.replace(/ /g, "_")}.pdf`;
//   const certificatePath = path.join(certificatesDir, certificateFileName);

//   try {
//     const doc = new PDFDocument({ size: "A4", margin: 50 });
//     const writeStream = fs.createWriteStream(certificatePath);
//     doc.pipe(writeStream);

//     // Document content
//     doc
//       .fillColor("#000")
//       .fontSize(30)
//       .text("CERTIFICATE OF COMPLETION", { align: "center" })
//       .moveDown(2);

//     doc
//       .fontSize(16)
//       .text("This is to certify that", { align: "center" })
//       .moveDown(1);

//     doc
//       .fontSize(26)
//       .text(userName, { align: "center", underline: true })
//       .moveDown(1.5);

//     doc
//       .fontSize(16)
//       .text(`has successfully completed the course`, { align: "center" })
//       .moveDown(0.5);

//     doc
//       .fontSize(20)
//       .text(`"${courseName}"`, { align: "center", italics: true })
//       .moveDown(1.5);

//     doc
//       .fontSize(16)
//       .text(`Date of Issue: ${issueDate}`, { align: "center" })
//       .moveDown(2);

//     doc.fontSize(14).text(`Mentor: ${instructorName}`, { align: "right" }).moveDown(1);
//     doc.fontSize(14).text(`Lernix by ${instructorName}`, { align: "left" });

//     doc.end();

//     writeStream.on("finish", async () => {
//       // Save the certificate URL in the course's certificates array
//       try {
//         const certificateUrl = `/certificates/${certificateFileName}`;

//         // Find the course and update the certificates array
//         const course = await Course.findById(courseId);
//         if (!course) {
//           return res.status(404).json({ success: false, message: "Course not found" });
//         }

//         // Add the certificate to the course's certificates array
//         course.certificates.push({
//           user: userId,
//           certificateUrl: certificateUrl,
//           issuedAt: new Date(),
//         });

//         // Save the updated course
//         await course.save();

//         res.json({
//           success: true,
//           message: "Certificate generated and saved successfully",
//           certificateUrl: certificateUrl,
//         });
//       } catch (err) {
//         res.status(500).json({ success: false, message: "Error saving certificate", error: err.message });
//       }
//     });

//     writeStream.on("error", (err) => {
//       throw err;
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error generating certificate", error: err.message });
//   }
// };

// with QR
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode'); // Library to generate QR codes
const Course = require('../models/Course'); // Adjust path if necessary

exports.generateCertificate = async (req, res) => {
  const { userName, courseName, issueDate, userId, courseId } = req.body;

  if (!userName || !courseName || !issueDate || !userId || !courseId) {
    return res.status(400).json({ message: "Missing userName, courseName, issueDate, userId, or courseId" });
  }

  const course = await Course.findById(courseId).populate('instructor', 'firstName lastName');
  if (!course) {
    return res.status(404).json({ success: false, message: "Course not found" });
  }

  const instructorName = `${course.instructor.firstName} ${course.instructor.lastName}`;

  const certificatesDir = path.join(__dirname, "../certificates");
  if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir, { recursive: true });
  }

  const certificateFileName = `${userName.replace(/ /g, "_")}_${courseName.replace(/ /g, "_")}.pdf`;
  const certificatePath = path.join(certificatesDir, certificateFileName);

  try {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const writeStream = fs.createWriteStream(certificatePath);
    doc.pipe(writeStream);
 
// Add a dotted background
doc.save().fillColor("#D3D3D3"); // Set fill color for dots
for (let x = 0; x < doc.page.width; x += 15) { // Adjust spacing between dots
  for (let y = 0; y < doc.page.height; y += 15) {
    doc.circle(x, y, 2).fill();
  }
}
 

doc.restore(); // Restore to default settings
    // Document content
    doc
      .fillColor("#000")
      .fontSize(30)
      .text("CERTIFICATE OF COMPLETION", { align: "center" })
      .moveDown(2);

    doc
      .fontSize(16)
      .text("This is to certify that", { align: "center" })
      .moveDown(1);

    doc
      .fontSize(26)
      .text(userName, { align: "center", underline: true })
      .moveDown(1.5);

    doc
      .fontSize(16)
      .text(`has successfully completed the course`, { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(20)
      .text(`"${courseName}"`, { align: "center", italics: true })
      .moveDown(1.5);

    doc
      .fontSize(16)
      .text(`Date of Issue: ${issueDate}`, { align: "center" })
      .moveDown(2);

    doc.fontSize(14).text(`Mentor: ${instructorName}`, { align: "right" }).moveUp(1);
    doc.fontSize(14).text(`Lernix by- ${instructorName}`, { align: "left" }).moveDown(1);;

    const certificateUrl = `/certificates/${certificateFileName}`;
    const qrCodeImageBuffer = await QRCode.toBuffer(certificateUrl);

    // Add QR code to the PDF at the bottom center
    doc.image(qrCodeImageBuffer, doc.page.width / 2 - 50, doc.page.height - 150, { fit: [100, 100], align: "center" });

    doc.end();

    writeStream.on("finish", async () => {
      try {
        // Save the certificate URL in the course's certificates array
        const course = await Course.findById(courseId);
        if (!course) {
          return res.status(404).json({ success: false, message: "Course not found" });
        }

        course.certificates.push({
          user: userId,
          certificateUrl: certificateUrl,
          issuedAt: new Date(),
        });

        await course.save();

        res.json({
          success: true,
          message: "Certificate generated and saved successfully",
          certificateUrl: certificateUrl,
        });
      } catch (err) {
        res.status(500).json({ success: false, message: "Error saving certificate", error: err.message });
      }
    });

    writeStream.on("error", (err) => {
      throw err;
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error generating certificate", error: err.message });
  }
};

