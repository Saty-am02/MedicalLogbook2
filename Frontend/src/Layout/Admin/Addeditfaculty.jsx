import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import axios from "axios";


const Addeditfaculty = () => {
  const [formData, setFormData] = useState({
    facultyname: "",
    applicationNumber: "",
    motherTongue: "",
    facultyid: "",
    department: "",
    dateOfJoining: "",
    dateOfBirth: "",
    gender: "",
    presentMobileNumber: "",
    previousMobileNumber: "",
    emailId: "",
    bloodGroup: "",
    nationality: "",
    religion: "",
    socialCategory: "",
  });
  const [errors, setErrors] = useState({});
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.facultyData) {
      const facultyData = location.state.facultyData;
      setFormData({
        facultyname: facultyData.facultyname,
        applicationNumber: facultyData.applicationNumber,
        motherTongue: facultyData.motherTongue,
        facultyid: facultyData.facultyid,
        department: facultyData.department,
        dateOfJoining: facultyData.dateOfJoining ? facultyData.dateOfJoining.slice(0, 10) : "",
        dateOfBirth: facultyData.dateOfBirth ? facultyData.dateOfBirth.slice(0, 10) : "",
        gender: facultyData.gender,
        presentMobileNumber: facultyData.presentMobileNumber,
        previousMobileNumber: facultyData.previousMobileNumber,
        emailId: facultyData.emailId,
        bloodGroup: facultyData.bloodGroup,
        nationality: facultyData.nationality,
        religion: facultyData.religion,
        socialCategory: facultyData.socialCategory,
      });
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "dateOfBirth" || name === "dateOfJoining") {
      // Convert the date value to the format "YYYY-MM-DD"
      const dateObject = new Date(value);
      formattedValue =
        dateObject.toISOString().split("T")[0];
    }

    setFormData({ ...formData, [name]: formattedValue });
    setErrors({ ...errors, [name]: "" });

    if (name === "dateOfBirth" || name === "dateOfJoining") {
      isValidDate(formattedValue, name);
    }
  };

  const handlephoneChange = (e) => {
    const truncatedValue = e.target.value.slice(0, 10);
    setFormData({ ...formData, [e.target.name]: truncatedValue });
  };

  const isValidDate = (dateString, fieldName) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      setErrors({ ...errors, [fieldName]: "Please enter a valid date." });
      return false;
    }

    if (
      fieldName === "dateOfJoining" &&
      date <= new Date(formData.dateOfBirth)
    ) {
      setErrors({
        ...errors,
        dateOfJoining:
          "Date of joining cannot be less than or equal to date of birth.",
      });
      return false;
    }

    // Ensure that the difference between doj and dob is at least 16 years
    const dob = new Date(formData.dateOfBirth);
    const sixteenYearsAgo = new Date(dob);
    sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() + 16);

    if (fieldName === "dateOfJoining" && date <= sixteenYearsAgo) {
      setErrors({
        ...errors,
        dateOfJoining: "Age should be 16.",
      });
      return false;
    }

    setErrors({ ...errors, [fieldName]: "" });

    return true;
  };

  const handlefacultydetails = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.facultyname) {
      newErrors.facultyname = "Name is required";
    } else if (formData.facultyname.length > 50) {
      newErrors.facultyname = "Name cannot exceed 50 characters";
    }

    if (!formData.previousMobileNumber) {
      newErrors.previousMobileNumber = "Phone number is required";
    } else if (!/\d{10}/.test(formData.previousMobileNumber)) {
      newErrors.previousMobileNumber = "Phone number must be 10 digits";
    }

    if (!formData.presentMobileNumber) {
      newErrors.presentMobileNumber = "Phone number is required";
    } else if (!/\d{10}/.test(formData.presentMobileNumber)) {
      newErrors.presentMobileNumber = "Phone number must be 10 digits";
    }

    if (!formData.facultyid) {
      newErrors.facultyid = "required"
    } else if (!/\d{4}/.test(formData.facultyid)) {
      newErrors.facultyid = "invalid format";
    }

    if (!formData.department) {
      newErrors.department = "required";
    } else if (!/^[A-Za-z]{3,5}$/.test(formData.department)) {
      newErrors.department = "invalid format";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required";
    } else if (!isValidDate(formData.dateOfBirth, "dateOfBirth")) {
      return;
    }

    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = "Date of Joining is required";
    } else if (!isValidDate(formData.dateOfJoining, "dateOfJoining")) {
      return;
    }

    if (!formData.emailId) {
      newErrors.emailId = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailId.trim())) {
      newErrors.emailId = "Invalid email format";
    }

    if (!formData.applicationNumber) {
      newErrors.applicationNumber = "application number is required";
    }

    if (!formData.motherTongue) {
      newErrors.motherTongue = "motherTongue is required";
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = "bloodGroup is required";
    } else if (!/^(A|B|AB|O)[+-]$/.test(formData.bloodGroup)) {
      newErrors.bloodGroup = "Invalid blood group";
    }

    if (!formData.religion) {
      newErrors.religion = "religion is required";
    } else if (!/^[A-Za-z\s-]{1,50}$/.test(formData.religion)) {
      newErrors.religion = "Invalid Religion format";
    }

    if (!formData.nationality) {
      newErrors.nationality = "nationality is required";
    } else if (!/^[A-Za-z\s-]{1,50}$/.test(formData.nationality)) {
      newErrors.nationality = "Invalid Nationality format";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Data saved successfully!");

      console.log("Data to be sent:", formData);

      try {
        // alert("Data saved");
        // Make a POST request to the backend API endpoint for login
        const facultyresponse = await axios.post(
          "http://localhost:8000/faculty/faculty-details",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }

        );
        setFormData({
          facultyname: "",
          applicationNumber: "",
          motherTongue: "",
          facultyid: "",
          department: "",
          dateOfJoining: "",
          dateOfBirth: "",
          gender: "",
          presentMobileNumber: "",
          previousMobileNumber: "",
          emailId: "",
          bloodGroup: "",
          nationality: "",
          religion: "",
          socialCategory: "",
        });

        

        // Check if the request was successful (status code 2xx)
        if (facultyresponse.status >= 200 && facultyresponse.status < 300) {
          console.log(facultyresponse.data);

          console.log("Data to be sent:", formData.emailId);
          // Make a POST request to the backend API endpoint for login
          const facultyemailresponse = await axios.post(
            "http://localhost:8000/faculty/send-mail",
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // Check if the request was successful (status code 2xx)
          if (
            facultyemailresponse.status >= 200 &&
            facultyemailresponse.status < 300
          ) {
            console.log(facultyemailresponse.data);

            // You can perform additional actions here, such as redirecting the user
          } else {
            // Handle errors from the backend
            const responseData = facultyemailresponse.data;
            setErrors(responseData.errors || {});
          }

          console.log("student email data sent:", formData.emailId);

          // You can perform additional actions here, such as redirecting the user
        } else {
          // Handle errors from the backend
          const responseData = facultyresponse.data;
          setErrors(responseData.errors || {});
        }
      } catch (error) {
        console.error("Error during faculty login:", error);
      }

      // Add logic to handle login (e.g., send data to server)
      console.log("faculty data submitted:", formData);
    }
  };


  
  return (
    <section >
      <div className="fixed left-12 top-30 ml-40">

        <button className=" bg-blue-500 w-48 h-10 rounded-lg ml-8 pl-1 pt-1 text-lg mt-7 focus:outline-none ">
          Add Faculty
        </button>
      </div>
      <div className="flex justify-center item-center">
        <div className="fixed sm:w-3/4 overflow-auto w-300 top-49 lg:ml-25 md:ml-25 sm:ml-175 h-100 pb-120 border-1 border-black rounded-2xl">
          <form
            className="md:w-275 h-99 ml-10 md:text-4 text-left sm:w-3/4 md:gap-4 sm:gap-3"
            onSubmit={handlefacultydetails}
          >
            <div className="grid md:grid-cols-1 lg:grid-cols-2 md:gap-4 sm:grid-cols-1 sm:gap-2 mt-8">
              <div>
                <label>Faculty Name:</label>
                <input
                  type="text"
                  className="border border-gray-700 w-125"
                  name="facultyname"
                  value={formData.facultyname}
                  onChange={handleChange}
                />
                {errors.facultyname && (
                  <div className="text-red-500">{errors.facultyname}</div>
                )}
              </div>
              <div>
                <label>Application number:</label>
                <input
                  type="text"
                  className="border border-gray-700 w-125"
                  name="applicationNumber"
                  value={formData.applicationNumber}
                  onChange={handleChange}
                />
                {errors.applicationNumber && (
                  <div className="text-red-500">{errors.applicationNumber}</div>
                )}
              </div>
              <div>
                <label>Faculty id:</label>
                <input
                  type="text"
                  className="border border-gray-700 w-125"
                  name="facultyid"
                  value={formData.facultyid}
                  onChange={handleChange}
                />
                {errors.facultyid && (
                  <div className="text-red-500">{errors.facultyid}</div>
                )}
              </div>
              <div>
                <label>Department:</label>
                <input
                  type="text"
                  className="border border-gray-700 w-125"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
                {errors.department && (
                  <div className="text-red-500">{errors.department}</div>
                )}
              </div>

              <div>
                <label>Mother tongue:</label>
                <input
                  type="text"
                  className="border border-gray-700 w-125"
                  name="motherTongue"
                  value={formData.motherTongue}
                  onChange={handleChange}
                />
                {errors.motherTongue && (
                  <div className="text-red-500">{errors.motherTongue}</div>
                )}
              </div>
              <div>
                <label>Date of joining:</label>
                <input
                  type="Date"
                  className="border border-gray-700 w-125"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                />
                {errors.dateOfJoining && (
                  <div className="text-red-500">{errors.dateOfJoining}</div>
                )}
              </div>
              <div>
                <label>Date of birth:</label>
                <input
                  type="Date"
                  className="border border-gray-700 w-125"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
                {errors.dateOfBirth && (
                  <div className="text-red-500">{errors.dateOfBirth}</div>
                )}
              </div>
              <div>
                <label>Gender</label>
                <select
                  className="py-4 px-10"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label>Present mobile number:</label>
                <input
                  type="text"
                  className="border border-gray-700 w-125"
                  name="presentMobileNumber"
                  value={formData.presentMobileNumber}
                  onChange={handlephoneChange}
                />
                {errors.presentMobileNumber && (
                  <div className="text-red-500">{errors.presentMobileNumber}</div>
                )}
              </div>
              <div>
                <label>Previous mobile number:</label>
                <input
                  type="text"
                  className="border border-gray-700 w-125"
                  name="previousMobileNumber"
                  value={formData.previousMobileNumber}
                  onChange={handlephoneChange}
                />
                {errors.previousMobileNumber && (
                  <div className="text-red-500">{errors.previousMobileNumber}</div>
                )}
              </div>
              <div>
                <label>Email id:</label>
                <input
                  type="text"
                  className="border border-gray-700 w-125"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                />
                {errors.emailId && (
                  <div className="text-red-500">{errors.emailId}</div>
                )}
              </div>
              <div>
                <label>Blood group:</label>
                <input
                  type="text"
                  className="border border-gray-700 w-125"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                />
                {errors.bloodGroup && (
                  <div className="text-red-500">{errors.bloodGroup}</div>
                )}
              </div>
              <div>
                <label>Nationality:</label>
                <input
                  type="text"
                  className="border border-gray-700 w-125"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                />
                {errors.nationality && (
                  <div className="text-red-500">{errors.nationality}</div>
                )}
              </div>
              <div>
                <label>Religion:</label>
                <input
                  type="text"
                  className="border border-gray-700 w-125"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                />
                {errors.religion && (
                  <div className="text-red-500">{errors.religion}</div>
                )}
              </div>



              <div>
                <label>Social category:</label>
                <input
                  type="text"
                  className="border border-gray-700 w-125"
                  name="socialCategory"
                  value={formData.socialCategory}
                  onChange={handleChange}
                />
                {errors.socialCategory && (
                  <div className="text-red-500">{errors.socialCategory}</div>
                )}
              </div>
            </div>
            <div className="flex sm:justify-self-center md:justify-center mt-8">
              <button
                type="submit"
                value="save"
                className="bg-blue-500 rounded-md w-40 h-auto text-white md:text-22 sm:text-lg"
                
              >
                Save 
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Addeditfaculty;