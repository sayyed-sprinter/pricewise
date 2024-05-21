import Image from "next/image";
import React from "react";

const PriceInfoCard = ({
  title,
  iconSrc,
  value,
  borderColor,
}: {
  title: string;
  iconSrc: string;
  value: string;
  borderColor: string;
}) => {
  return (
    <div
      className={`price-info_card border-1 `}
      style={{ borderColor }}
    >
      <p className="text-base text-black-100">{title}</p>
      <div className="flex gap-1">
        <Image
          src={iconSrc}
          alt={title}
          width={24}
          height={24}
        />
        <p className="text-2xl font-bold text-secondary">
          {value}
        </p>
      </div>
    </div>
  );
};

export default PriceInfoCard;
