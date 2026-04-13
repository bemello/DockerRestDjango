import ProfileDetails from "../components/ProfileDetails";
import ManageRecipes from "../components/ManageRecipes";
import ManageIngredients from "../components/ManageIngredients";
import ManageTags from "../components/ManageTags";

function ProfilePage({ user, setUser }) {
  const showContent = (e) => {
    let buttons = document.getElementsByClassName("profile-page-tab");
    let sections = document.getElementsByClassName("profile-page-content");
    const targetContent = document.getElementById(
      e.getAttribute("targetcontent"),
    );

    for (let i = 0; i < sections.length; i++) {
      sections[i].removeAttribute("active");
    }

    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i] !== e) {
        buttons[i].removeAttribute("active");
      }
    }

    e.setAttribute("active", "");
    targetContent.setAttribute("active", "");
  };

  return (
    <section id="profile-page" className="max-w-7xl mx-auto py-16">
      <div className="text-center">
        <h2 className="font-display text-5xl font-bold text-primary mb-6 dark:text-background-cream">
          {user.name ? user.name : user.email}
        </h2>
        <div className="w-20 h-1 bg-accent mx-auto"></div>

        <div className="profile-navbar">
          <button
            targetcontent="profile-details"
            onClick={(e) => showContent(e.target)}
            className="profile-page-tab dark:bg-background-brown"
            active="true"
          >
            Profile Details
          </button>
          <button
            targetcontent="manage-recipes"
            onClick={(e) => showContent(e.target)}
            className="profile-page-tab dark:bg-background-brown/50"
          >
            Manage Recipes
          </button>
          <button
            targetcontent="manage-ingredients"
            onClick={(e) => showContent(e.target)}
            className="profile-page-tab dark:bg-background-brown/50"
          >
            Manage Ingredients
          </button>
          <button
            targetcontent="manage-tags"
            onClick={(e) => showContent(e.target)}
            className="profile-page-tab dark:bg-background-brown/50"
          >
            Manage Tags
          </button>
        </div>
      </div>
      <div
        id="profile-details"
        className="profile-page-content bg-background-cream dark:bg-background-brown"
        active="true"
      >
        <ProfileDetails user={user} setUser={setUser} />
      </div>
      <div
        id="manage-recipes"
        className="profile-page-content bg-background-cream dark:bg-background-brown"
      >
        <ManageRecipes />
      </div>
      <div
        id="manage-ingredients"
        className="profile-page-content bg-background-cream dark:bg-background-brown"
      >
        <ManageIngredients />
      </div>
      <div
        id="manage-tags"
        className="profile-page-content bg-background-cream dark:bg-background-brown"
      >
        <ManageTags />
      </div>
    </section>
  );
}

export default ProfilePage;
