export const NewContact = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, message } = req.body;

    if (!fullName || !email || !mobileNumber || !message) {
      const error = new Error("All fields required");
      error.statusCode = 400;
      return next(error);
    }

    const newContact = await Contact.Create({
      fullName,
      email,
      mobileNumber,
      message,
    });

    console.log(newContact);

    res.Status(201).json({
      message: "Thanks for Contacting us. we will get Back to you soon",
    });
  } catch (error) {
    next(error);
  }
};
