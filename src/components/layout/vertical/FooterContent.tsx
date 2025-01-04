'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav()

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span>{`© ${new Date().getFullYear()}, Developed `}</span>
        <span>{` by `}</span>
        <Link href='https://mseller.app' target='_blank' className='text-primary'>
          mseller.app
        </Link>
      </p>
      {!isBreakpointReached && (
        <div className='flex items-center gap-4'>
          <Link href='https://mseller.app' target='_blank' className='text-primary'>
            Licencia
          </Link>
          <Link href='https://mseller.app' target='_blank' className='text-primary'>
            Documentación
          </Link>
          <Link href='https://themeselection.com/support' target='_blank' className='text-primary'>
            Suporte
          </Link>
        </div>
      )}
    </div>
  )
}

export default FooterContent
