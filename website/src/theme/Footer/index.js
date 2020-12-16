import React from 'react';
import OriginalFooter from '@theme-original/Footer';

export default function Footer(props) {
  const
    [isNoticeHidden, setIsNoticeHidden] = React.useState(!!localStorage.getItem('noticeRead')),
    onHideNotice = () => {
      localStorage.setItem('noticeRead', true)
      setIsNoticeHidden(true)
    }
  return (
    <>
      <section className='notice' style={{ opacity: isNoticeHidden ? 0 : 1 }}>
        <div>
          <p>By using this website you agree to our use of cookies. </p>
          <a href='https://www.h2o.ai/privacy/' target='_blank'>Read H2O.ai’s privacy policy.</a>
        </div>
        <span className='notice__close' onClick={onHideNotice}>X</span>
      </section>
      <OriginalFooter {...props} />
    </>
  )
}