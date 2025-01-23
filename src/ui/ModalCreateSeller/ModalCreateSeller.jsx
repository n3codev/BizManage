import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createSeller } from "../../services/apiSellers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import "./ModalCreateSeller.css";

function ModalCreateSeller({ isOpen, onConfirm, onCancel }) {
  const queryClient = useQueryClient();
  const ref = useRef();

  const mutation = useMutation(createSeller, {
    onSuccess: () => {
      queryClient.invalidateQueries("seller");
      toast.success("Seller created successfully!");
      onConfirm();
    },
    onError: () => {
      toast.error("Failed to create seller.");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    mutation.mutate(data);
    reset();
  };

  /* CLICK OUTSIDE MODAL TO CLOSE */
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
    <div className="modal-overlay">
      <div className="modal-content" ref={ref}>
        <h2>Create Seller</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="label">
            Company Name:
            <input
              className="input"
              {...register("companyName", {
                required: "Company name is required",
              })}
              placeholder="Enter company name"
            />
            {errors.companyName && (
              <span className="error-message">
                {errors.companyName.message}
              </span>
            )}
          </label>
          <label className="label">
            HQ Address:
            <input
              className="input"
              {...register("hqAddress", {
                required: "HQ Address is required",
              })}
              placeholder="Enter HQ address"
            />
            {errors.hqAddress && (
              <span className="error-message">{errors.hqAddress.message}</span>
            )}
          </label>

          <div className="div-is-active">
            <p>Is Active:</p>
            <div>
              <input
                type="checkbox"
                className="input-check"
                {...register("isActive")}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="button"
              className="button button-discard"
              onClick={onCancel}
            >
              Discard
            </button>
            <button type="submit" className="button button-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ModalCreateSeller.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ModalCreateSeller;
