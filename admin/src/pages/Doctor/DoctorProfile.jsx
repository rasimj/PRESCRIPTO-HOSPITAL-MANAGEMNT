import React, { useEffect, useContext, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const [isEdit, setIsEdit] = useState(false);
  const [editableProfile, setEditableProfile] = useState(null);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: editableProfile.address,
        fees: Number(editableProfile.fees),
        available: editableProfile.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        {
          headers: { dToken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  useEffect(() => {
    if (profileData) {
      setEditableProfile(profileData);
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setEditableProfile((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setEditableProfile((prev) => ({
        ...prev,
        [name]: name === "fees" ? Number(value) : value,
      }));
    }
  };

  const handleAvailabilityChange = () => {
    setEditableProfile((prev) => ({
      ...prev,
      available: !prev.available,
    }));
  };

  const renderAddress = (address) => {
    if (!address) return "N/A";
    if (typeof address === "string") return address;

    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.pincode,
    ];

    return parts.filter(Boolean).join(", ");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto mt-10">
      {editableProfile ? (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex flex-col sm:flex-row items-center gap-6 text-white">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={editableProfile.image}
                alt="Doctor"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-4xl font-bold tracking-tight">
                {editableProfile.name}
              </h2>
              <p className="text-lg font-medium mt-1">
                {editableProfile.speciality}
              </p>
              <p className="text-sm opacity-90 mt-1">
                {editableProfile.degree}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
            <InfoCard
              label="Experience"
              value={`${editableProfile.experience} `}
            />

            <InfoCard
              label="Fees"
              value={
                isEdit ? (
                  <input
                    type="number"
                    name="fees"
                    value={editableProfile.fees}
                    onChange={handleInputChange}
                    className="border p-1 rounded w-24"
                    min="0"
                    step="0.01"
                  />
                ) : (
                  `$ ${editableProfile.fees}`
                )
              }
            />

            <InfoCard
              label="Available"
              value={
                <span
                  className={`font-semibold ${
                    editableProfile.available
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {editableProfile.available ? "Yes" : "No"}
                </span>
              }
            />

            <InfoCard
              label="Address"
              value={
                isEdit ? (
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      name="address.line1"
                      value={editableProfile.address?.line1 || ""}
                      onChange={handleInputChange}
                      placeholder="Line 1"
                      className="border p-1 rounded"
                    />
                    <input
                      type="text"
                      name="address.line2"
                      value={editableProfile.address?.line2 || ""}
                      onChange={handleInputChange}
                      placeholder="Line 2"
                      className="border p-1 rounded"
                    />
                    <input
                      type="text"
                      name="address.city"
                      value={editableProfile.address?.city || ""}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="border p-1 rounded"
                    />
                    <input
                      type="text"
                      name="address.state"
                      value={editableProfile.address?.state || ""}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="border p-1 rounded"
                    />
                    <input
                      type="text"
                      name="address.pincode"
                      value={editableProfile.address?.pincode || ""}
                      onChange={handleInputChange}
                      placeholder="Pincode"
                      className="border p-1 rounded"
                    />
                  </div>
                ) : (
                  renderAddress(editableProfile.address)
                )
              }
            />
          </div>

          {/* About Section */}
          {editableProfile.about && (
            <div className="bg-gray-50 border-t px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                About
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {editableProfile.about}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg">
          Loading profile...
        </div>
      )}

      {/* Action Controls */}
      {editableProfile && (
        <div className="flex items-center gap-4 pt-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editableProfile.available}
              onChange={handleAvailabilityChange}
              className="accent-blue-600"
            />
            Available
          </label>

          <button
            onClick={() => {
              if (isEdit) {
                updateProfile();
              } else {
                setIsEdit(true);
              }
            }}
            className="px-4 py-1 border border-blue-600 text-sm rounded-full hover:bg-blue-600 hover:text-white text-blue-600 transition-all"
          >
            {isEdit ? "Save" : "Edit"}
          </button>

          {isEdit && (
            <button
              onClick={() => {
                setIsEdit(false);
                setEditableProfile(profileData);
              }}
              className="px-4 py-1 border border-gray-400 text-sm rounded-full hover:bg-gray-100 text-gray-600 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Reusable InfoCard component
const InfoCard = ({ label, value }) => (
  <div className="bg-gray-50 p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <div className="text-lg font-semibold break-words">{value}</div>
  </div>
);

export default DoctorProfile;
