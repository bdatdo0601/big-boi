import React, { useState, useEffect } from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { useForm } from "react-hook-form";
import { Button, Input, Paper, Typography } from "@mui/material";

import "./index.less";

const CustomForm = ({ status, message, onValidated, onCloseModal }) => {
  const { register, reset, handleSubmit } = useForm();

  const onSubmit = data => {
    if (data.email && data.firstName && data.email.indexOf("@") > -1) {
      onValidated({
        EMAIL: data.email,
        FNAME: data.firstName,
      });
    }
    reset();
  };

  useEffect(() => {
    if (status === "success") reset();
    if (status === "success") reset();
  }, [status, reset]);
  return (
    <form className="mc__form" onSubmit={e => handleSubmit(e)}>
      <Typography variant="h5" className="mc__title">
        {status === "success" ? "Success!" : "Want to Stay Updated?"}
      </Typography>
      {status === "sending" && <div className="mc__alert mc__alert--sending">sending...</div>}
      {status === "error" && (
        <div className="mc__alert mc__alert--error" dangerouslySetInnerHTML={{ __html: message }} />
      )}
      {status === "success" && (
        <div className="mc__alert mc__alert--success" dangerouslySetInnerHTML={{ __html: message }} />
      )}

      {status !== "success" ? (
        <div className="mc__field-container">
          <Input
            label="First Name"
            type="text"
            placeholder="First Name"
            isRequired
            {...register("firstName", { required: true })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            isRequired
            {...register("email", { required: true })}
          />
        </div>
      ) : null}

      {!status && (
        <Typography variant="p" className="mc__info">
          I will be mindful of your mailbox! You can unsubscribe anytime
        </Typography>
      )}

      {/*Close button appears if form was successfully sent*/}
      {status === "success" ? (
        <Button color="secondary" type="submit" variant="outlined" onClick={onCloseModal}>
          Close Modal
        </Button>
      ) : (
        <Button color="secondary" type="submit" variant="contained" onClick={handleSubmit(onSubmit)}>
          Subscribe
        </Button>
      )}
    </form>
  );
};

const MailchimpForm = props => {
  const url = `https://datbdo.us12.list-manage.com/subscribe/post?u=fa8193682bc7f355d2d565c2f&id=8779558f85`;

  return (
    <div className="mc__form-container">
      <MailchimpSubscribe
        url={url}
        render={({ subscribe, status, message }) => (
          <Paper className="subscribe-form-container">
            <CustomForm status={status} message={message} onValidated={formData => subscribe(formData)} {...props} />
          </Paper>
        )}
      />
    </div>
  );
};

export default MailchimpForm;
