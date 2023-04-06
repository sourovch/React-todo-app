import { useEffect, useState } from 'react';

const useModal = (initModal) => {
  const isOpenClass = 'modal-is-open';
  const openingClass = 'modal-is-opening';
  const closingClass = 'modal-is-closing';
  const animationDuration = 400;
  const [modal, setModal] = useState(initModal);
  const [visibleModal, setVisibleModal] = useState();

  const toggleModal = (event) => {
    event?.preventDefault();
    typeof modal != 'undefined' && modal != null && isModalOpen(modal)
      ? closeModal()
      : openModal();
  };

  const isModalOpen = () => {
    return modal.hasAttribute('open') &&
      modal.getAttribute('open') != 'false'
      ? true
      : false;
  };

  const openModal = () => {
    if (isScrollbarVisible()) {
      document.documentElement.style.setProperty(
        '--scrollbar-width',
        `${getScrollbarWidth()}px`
      );
    }
    document.documentElement.classList.add(isOpenClass, openingClass);
    setTimeout(() => {
      setVisibleModal(modal);
      document.documentElement.classList.remove(openingClass);
    }, animationDuration);
    modal.setAttribute('open', true);
  };

  const closeModal = () => {
    setVisibleModal(null);
    document.documentElement.classList.add(closingClass);
    setTimeout(() => {
      document.documentElement.classList.remove(
        closingClass,
        isOpenClass
      );
      document.documentElement.style.removeProperty(
        '--scrollbar-width'
      );
      modal.removeAttribute('open');
    }, animationDuration);
  };

  const getScrollbarWidth = () => {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  };

  const isScrollbarVisible = () => {
    return document.body.scrollHeight > screen.height;
  };

  useEffect(() => {
    function closeONOutsideCick(event) {
      if (visibleModal != null) {
        const modalContent = visibleModal.querySelector('article');
        const isClickInside = modalContent.contains(event.target);
        !isClickInside && closeModal(visibleModal);
      }
    }

    function closeOnEscClick(event) {
      if (event.key === 'Escape' && visibleModal != null) {
        closeModal(visibleModal);
      }
    }

    document.addEventListener('keydown', closeOnEscClick);
    document.addEventListener('click', closeONOutsideCick);

    return () => {
      document.removeEventListener('click', closeONOutsideCick);
      document.removeEventListener('keydown', closeOnEscClick);
    };
  }, [visibleModal]);

  return {
    toggleModal,
    openModal,
    closeModal,
    setModal,
  };
};

export default useModal;
