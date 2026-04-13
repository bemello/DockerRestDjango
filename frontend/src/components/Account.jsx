function Account() {
  return (
    <div className="user-info">
      <label className="block text-[11px] font-bold mb-4 uppercase tracking-[0.25em] text-slate-400">
        Last 5 accesses
      </label>
      <div className="flex flex-col gap-2">
        {user.access_history
          ?.sort((a, b) => new Date(b.access_time) - new Date(a.access_time))
          .slice(0, 5)
          .map((access, index) => (
            <div key={index} className="grid grid-cols-1">
              <span className="text-md font-semibold text-accent dark:text-accent">
                {new Date(access.access_time).toLocaleString("en-US", {
                  hour12: false,
                  hourCycle: "h23",
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
              <div className="flex gap-2 text-primary dark:text-slate-300 px-2">
                <span>
                  <span className="font-bold">Location:</span>{" "}
                  {access.location}
                </span>
                <span>
                  <span className="font-bold">IP:</span> {access.ip_address}
                </span>
                <span>
                  <span className="font-bold">Browser:</span> {access.browser}
                </span>
                <span>
                  <span className="font-bold">Device:</span> {access.device} (
                  {access.os})
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Account;
