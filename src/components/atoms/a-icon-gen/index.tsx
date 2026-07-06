import React from 'react';
import HomeSvg from '../../../assets/images/svg/home';
import OrderSvg from '../../../assets/images/svg/order';
import PackageSvg from '../../../assets/images/svg/package';
import ChatSvg from '../../../assets/images/svg/chat';
import AccountSvg from '../../../assets/images/svg/account';
import ResultsSvg from '../../../assets/images/svg/results';

interface IconGeneratorProps {
  tagName: string | undefined;
  focused?: boolean;
  color: string;
  route?: Readonly<object | undefined>;
}

const components = {
  HomeSvg,
  OrderSvg,
  PackageSvg,
  ChatSvg,
  AccountSvg,
  ResultsSvg,
};

const IconGenerator = ({tagName, ...props}: IconGeneratorProps) => {
  // @ts-ignore
  const TagName = components[tagName];

  if (TagName) {
    return <TagName {...props} />;
  } else {
    return null;
  }
};

export default IconGenerator;
