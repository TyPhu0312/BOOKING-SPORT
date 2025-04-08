import React from "react";

interface TitleListCardProps {
  title: string;
  children: React.ReactNode;
  link?: string;
}

const TitleListCard: React.FC<TitleListCardProps> = ({ title, children, link }) => {
  return (
    <div className="w-full h-auto m-[15px] flex flex-col gap-6 px-4 md:px-[90px]">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-start">
          {title}
        </h1>
        {link && (
          <a
            href={link}
            className="text-gray-800 underline hover:text-black"
          >
            Xem tất cả
          </a>
        )}
      </div>

      <div className="w-full flex justify-center">{children}</div>
    </div>

  );
};

export default TitleListCard;
