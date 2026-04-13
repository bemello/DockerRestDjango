import egg from "../assets/egg.jpg";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="max-w-7xl mx-auto">
      <div
        className="page-not-found flex justify-around px-10 pb-30 h-full w-full text-[450px] font-bold text-accent dark:text-white mask-radial-from-40% mask-radial-to-90% mask-radial-[55%_48%] mask-position-[center_top_-4rem] bg-cover bg-position-[center_top_-8rem] bg-no-repeat"
        style={{ backgroundImage: `url(${egg})` }}
      >
        <span>4</span>
        <span>4</span>
      </div>
      <div className="page-not-found-content flex flex-col items-center justify-center px-10 h-full w-full">
        <p className="text-5xl text-primary dark:text-primary font-display italic leading-relaxed">
          Oops, it looks like we're lost...
        </p>
        <p className="text-xl text-slate-500 dark:text-primary font-display leading-relaxed">
          Let's get back to the right path!
        </p>
        <Link
          to="/"
          className="px-5 py-2 mt-5 border border-primary text-primary rounded-full text-xs font-semibold flex items-center gap-2 transition-all hover:bg-primary hover:text-white"
        >
          <span className="material-symbols-outlined text-[16px]">home</span>
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
