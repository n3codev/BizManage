import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./ModalDelete.css";

function ModalDelete({ isOpen, onConfirm, onCancel }) {
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onCancel();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-delete-overlay">
      <div className="modal-delete-content" ref={ref}>
        <h3>Are you sure?</h3>
        <button
          className="delete-button delete-button-confirm"
          onClick={onConfirm}
        >
          Yes
        </button>
        <button
          className="delete-button delete-button-cancel"
          onClick={onCancel}
        >
          No
        </button>
      </div>
    </div>
  );
}

ModalDelete.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ModalDelete;
