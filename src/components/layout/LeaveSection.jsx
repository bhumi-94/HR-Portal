import React, { useState } from "react";
import LeaveRequestModal from "./LeaveRequestModal";

const LeaveSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="mt-8 rounded-[28px] border border-[#eee7df] bg-white p-6 shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
        {/* HEADER */}
        <div className="mb-6">
          <p className="text-sm font-medium text-[#b08a68]">Leave Management</p>

          <h2 className="mt-1 text-2xl font-bold text-[#292524]">Your Leave</h2>

          <p className="mt-1 text-sm text-[#8f8983]">
            Track your leave and manage your requests.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* CASUAL */}
          <div className="flex rounded-[24px] justify-between border  border-[#eee7df] bg-[#fcfaf8] py-5 px-10">
            <div>
              <p className="text-sm font-medium text-[#9c958f]">Casual Leave</p>
              <p className="mt-2 text-3xl font-bold text-[#292524]">7</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#9c958f]">
                Pending Leave
              </p>
              <p className="mt-2 text-3xl font-bold text-[#292524]">5</p>
            </div>
          </div>

          {/* SICK */}

          <div className="flex rounded-[24px] justify-between border  border-[#eee7df] bg-[#fcfaf8] py-5 px-10">
            <div>
              <p className="text-sm font-medium text-[#9c958f]">Casual Leave</p>
              <p className="mt-2 text-3xl font-bold text-[#292524]">7</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#9c958f]">
                Pending Leave
              </p>
              <p className="mt-2 text-3xl font-bold text-[#292524]">5</p>
            </div>
          </div>
        </div>

        {/* REQUEST BUTTON */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="
              rounded-2xl
              bg-[#8b5aa8]
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              shadow-[0_8px_20px_rgba(139,90,168,0.22)]
              transition
              hover:bg-[#764994]
              active:scale-[0.98]
            "
          >
            Request For Leave
          </button>
        </div>
      </section>

      {/* MODAL */}
      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default LeaveSection;
