import { USER_SESSION } from "../utils/constants";
import { useState } from "react";
import api from "../utils/api";

function ProfileDetails({ user, setUser }) {
  const [changedFields, setChangedFields] = useState(new Map());

  const [profilePicture, setProfilePicture] = useState(() => {
    return user ? user.profile_picture : "";
  });

  const originalName = user ? user.name.repeat(1) : "";
  const originalEmail = user ? user.email.repeat(1) : "";

  const [name, setName] = useState(() => {
    return user ? user.name : "";
  });

  const [email, setEmail] = useState(() => {
    return user ? user.email : "";
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleAddImage = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  function submitUserData(formData, headers) {
    return api.patch(`api/user/me/`, formData, headers);
  }

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile_picture", selectedFile);

    try {
      const res = await submitUserData(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfilePicture(res.data.profile_picture);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
    closeImageModal();
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    changedFields.forEach((value, key) => {
      formData.append(key, value);
    });

    try {
      const res = await submitUserData(formData);
      setProfilePicture(res.data.profile_picture);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
    closeImageModal();
  };

  const openImageModal = () => {
    setSelectedFile(undefined);
    document.getElementById("imageModal").classList.remove("hidden");
  };

  const closeImageModal = () => {
    setSelectedFile(undefined);
    document.getElementById("imageModal").classList.add("hidden");
  };

  return (
    <div className="profile-box">
      <div
        className="profile-picture"
        style={{
          background: `url(${profilePicture}) no-repeat center/cover`,
        }}
      >
        <div onClick={openImageModal} className="profile-picture-mask">
          {/* <div className="text-background-light/70 opacity-0 group-hover:opacity-100 transition duration-200 text-center">
            <span className="material-symbols-outlined scale-150 py-2">
              replace_image
            </span>
            <p className="text-primary/70 text-sm">
              Change the profile picture
            </p>
          </div> */}
        </div>
        <div
          id="imageModal"
          className="fixed inset-1 z-50 grid place-content-center backdrop-blur-[4px] p-4 hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <div className="w-lg rounded-xl bg-dashboard-bg border border-info/30 px-4 py-4 shadow-lg">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeImageModal}
                className="text-gray-400 transition-colors hover:text-primary/30 focus:outline-none"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-4 pb-4">
              <div className="flex flex-col items-center justify-center">
                <div className="pb-4 text-center">
                  <p className="text-lg font-semibold text-primary dark:text-primary">
                    Select an image to set as the profile picture.
                  </p>
                </div>
                <label
                  id="image_upload_label"
                  htmlFor="image_upload_input"
                  className="cursor-pointer py-1 px-3 border border-accent/30 bg-accent/30 text-accent hover:bg-accent/40 font-bold rounded-lg transition"
                >
                  Choose a file
                </label>
                <input
                  id="image_upload_input"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAddImage}
                />
                {selectedFile && (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <p className="text-md font-semibold text-primary dark:text-primary pb-1">
                      Selected file: {selectedFile.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleImageSubmit}
                id="submit"
                type="button"
                disabled={!selectedFile}
                className="inline-flex w-full justify-center rounded-md bg-deep-navy px-4 py-2 text-sm font-semibold text-info transition hover:bg-deep-navy/60 sm:ml-3 sm:w-auto disabled:opacity-0 disabled:cursor-default"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-box-content">
        <div className="user-name">{name}</div>
        <div className="user-info">Date Joined: 01/01/2026</div>
        <div className="user-email">{email}</div>
      </div>
    </div>
  );
}

export default ProfileDetails;
