const telValidator = (tel) => {
  if (/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/.test(tel)) {
    return true;
  }
  return false;
};

const ssnValidator = (ssn) => {
  if (
    /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-4][0-9]{6}$/.test(
      ssn
    )
  ) {
    return true;
  }
  return false;
};

const emailValidator = (email) => {
  if (
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
      email
    )
  ) {
    return true;
  }
  return false;
};

const pwValidator = (pw) => {
  if (/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,10}$/.test(pw)) {
    return true;
  }
  return false;
};
export { telValidator, ssnValidator, emailValidator, pwValidator };
