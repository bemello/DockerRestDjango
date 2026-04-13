import { useState } from "react";

function ProfileCard({ user }) {
  const [profilePicture, setProfilePicture] = useState(() => {
    return user.profile_picture;
  });

  const [name, setName] = useState(() => {
    return user.name ? user.name : "Recipe User#" + user.id;
  });

  const [email, setEmail] = useState(() => {
    return user.email;
  });

  return (
    <div className="profile-box">
      <div
        className="profile-picture"
        style={{
          background: `url(${profilePicture}) center/cover no-repeat`,
        }}
      >
        {/* <img src={profilePicture} alt="Profile Picture" /> */}
      </div>

      <div className="profile-box-content">
        <div className="user-name">{name}</div>
        <div className="user-info">Date Joined: 01/01/2026</div>
        <div className="user-email">{email}</div>
      </div>
    </div>
  );
}

export default ProfileCard;
