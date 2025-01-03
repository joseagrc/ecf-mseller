// React Imports
//import type { SVGAttributes } from 'react'

import Image from 'next/image'

const Logo = ({ className }: any) => {
  return <Image width={30} height={20} src='/images/logos/m-mseller.png' alt='MSeller Logo' className={className} />
}

export default Logo
