import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import "./ModalEditSellers.css";

function ModalEditSeller({ isOpen, onConfirm, onCancel, seller }) {
  const ref = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      companyName: "",
      hqAddress: "",
      isActive: false,
      ...seller,
    },
  });

  useEffect(() => {
    if (seller && typeof seller === "object") {
      reset(seller);
    }
  }, [seller, reset]);

  const onSubmit = (data) => {
    onConfirm(data);
    reset();
  };

  // Dodavanje logike za detekciju klika van modala
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
    <div className="sellers-modal-overlay">
      <div className="sellers-modal-content" ref={ref}>
        <h2>Edit Seller</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="sellers-label">
            Company Name:
            <input
              className="sellers-input"
              {...register("companyName", {
                required: "Company name is required",
              })}
              placeholder="Enter company name"
            />
            {errors.companyName && (
              <span className="sellers-error-message">
                {errors.companyName.message}
              </span>
            )}
          </label>
          <label className="sellers-label">
            HQ Address:
            <input
              className="sellers-input"
              {...register("hqAddress")}
              placeholder="Enter HQ address"
            />
          </label>

          <div className="sellers-div-is-active">
            <p>Is Active:</p>
            <div>
              <input
                className="sellers-input-check"
                type="checkbox"
                {...register("isActive")}
              />
            </div>
          </div>

          <div className="sellers-button-container">
            <button
              className="sellers-button-discard"
              type="button"
              onClick={onCancel}
            >
              Discard
            </button>
            <button className="sellers-button-save" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ModalEditSeller.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  seller: PropTypes.shape({
    id: PropTypes.string.isRequired,
    companyName: PropTypes.string,
    hqAddress: PropTypes.string,
    isActive: PropTypes.bool,
  }),
};

export default ModalEditSeller;
