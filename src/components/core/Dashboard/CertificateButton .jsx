import React from "react";
import { generateCertificateFE } from "../../../services/operations/certificateAPI";
import { FaFileDownload } from "react-icons/fa";
import { useSelector } from "react-redux";
import {toast} from "react-hot-toast"
const CertificateButton = ({ course, token }) => {
  const { user } = useSelector((state) => state.profile);
  const { firstName, lastName } = user;  //  
// const {courseEntireData,
//     }=useSelector((state)=>state.viewCourse);
  
  const handleGenerateCertificate = async () => {
    
    console.log("data from Certificate geneneration course", course)
    const data = {
    userName: `${firstName} ${lastName}`,  // Combining first and last name
    courseName: course.courseName,
    // instructor: course.instructor,
    userId: user._id,  // Assuming the user ID is available
    courseId: course._id,
    issueDate: new Date().toISOString().slice(0, 10), // Today's date
    };

    const response = await generateCertificateFE(data, token);
    console.log("certificate gen response from BE->", response);
    if (response && response.success) {
      // const baseUrl =   "http://localhost:4000";
      const baseUrl = "https://study1.onrender.com"
 const certificateUrl = `${baseUrl}${response.certificateUrl}`;
 console.log("Final certificate URL:", certificateUrl);
toast.success(response.message)
window.open(certificateUrl, "_blank");

      // window.open(response.certificateUrl, "_blank");
    } else {
      toast.error("Error generating certificate. Please try again.");
    }
  };

  return (
    course.progressPercentage === 100 && (
      <button
        onClick={handleGenerateCertificate}
        className="text-center"
      >
      <FaFileDownload />

      </button>
    )
  );
};

export default CertificateButton;
