import React from "react";

interface TitleListCardProps {
  title: string;
  children: React.ReactNode;
  link?: string;
}

const TitleListCard: React.FC<TitleListCardProps> = ({ title, children, link }) => {
  return (
    <div className="w-full h-auto m-[15px] flex flex-col gap-6">
      <div className="flex justify-between items-center w-full px-4">
        <h1 className="text-2xl font-bold  text-start md:text-start text-gray-800 md:pl-[90px]">
          {title}
        </h1>
        {link && (
          <a href={link} className="pr-[20px] md:pr-[120px] text-gray-800 underline hover:text-black">
            Xem tất cả
          </a>
        )}
      </div>
      <div className="w-full justify-center flex">{children}</div>
    </div>
  );
};

export default TitleListCard;
