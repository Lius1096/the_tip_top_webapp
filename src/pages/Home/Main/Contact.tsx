import React, { useRef, useState } from "react";
import HomeTitle from "../../../components/HomeTitle";
import InputContactComponent from "../../../components/InputContactComponent";
import RitchText from "../../../components/RitchText";
import HomeButton from "../../../components/HomeButton";
import music from "../../../Assets/Icons/tiktok-gradient.svg";
import facebook from "../../../Assets/Icons/facebook-gradient.svg";
import instagram from "../../../Assets/Icons/insta-gradient.svg";
import youtub from "../../../Assets/Icons/youtube-gradient.svg";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import { validateEmail } from "../../Validation/Email";
import { validateFullName } from "../../Validation/FullName";
import { validateSubject } from "../../Validation/Subject";
import { validateMessage } from "../../Validation/Message";
import toast from "react-hot-toast";

const Contact = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setIsEmailError] = useState(false);
  const [subjectError, setIsSubjectError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [recaptcha, setRecaptcha] = useState("");
 

  const [loading, setLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleFullName = (value: string) => {
    setFullName(value);
  };
  const handleEmail = (value: string) => {
    setEmail(value);
  };
  const handleSubject = (value: string) => {
    setSubject(value);
  };
  const handleMessage = (value: string) => {
    console.log(value);
    setMessage(value);
  };

  const validate = () => {
    let isFullNameError = !validateFullName(fullName).valid;
    let isEmailError = !validateEmail(email).valid;
    let isSubjectError = !validateSubject(subject).valid;
    let isMessageError = !validateMessage(message).valid;
    setIsEmailError(isEmailError);
    setFullNameError(isFullNameError);
    setMessageError(isMessageError);
    setIsSubjectError(isSubjectError);
    if (
      !isFullNameError &&
      !isEmailError &&
      !isSubjectError &&
      !isMessageError &&
      recaptcha
    ) {
      return true;
    } else {
      return false;
    }
  };
  const sendEmail = (e: any) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      if (formRef.current) {
        emailjs
          .sendForm("service_3lh4ukq", "template_i63edrc", formRef.current, {
            publicKey: "ITI35GyVtHbhsF0iy",
          })
          .then(
            (response) => {
              toast.success(
                "Nous vous remercions pour votre message. Celui-ci a été transmis avec succès à l'équipe de Thé Tip Top !"
              );
              setEmail("");
              setFullName("");
              setMessage("");
              setSubject("");
              setLoading(false);
            },
            (error: any) => {
              toast.error(error);
              setLoading(false);
            }
          );
      }
    }
  };

  return (
    <section
      style={{
        background:
          "linear-gradient(357deg, rgba(142, 137, 37, 0.29) 0.06%, rgba(142, 137, 37, 0.00) 95.01%)",
      }}
      id="section-3"
    >
      <div className="p-[20px] xl:p-[100px] lg:pl-0 flex lg:justify-end  lg:bg-section3 bg-no-repeat lg:bg-left xl:bg-[length:40%] lg:bg-[length:50%] px-4 md:px-8 xl:px-[100px]">
        <div className="flex flex-col lg:w-[60%] 2xl:w-1/2 gap-y-6 xl:gap-y-10 ">
          <div className="flex flex-col xl:gap-y-4 gap-y-2">
            <HomeTitle title="Tassez-nous vos saveurs ?" />
            <h3 className="text-lg font-semibold text-left text-text">
              Des questions, des suggestions ou simplement envie de partager
              votre amour du thé avec nous ? Nous sommes à votre disposition !
              🍵💬
            </h3>
          </div>
          <form ref={formRef} id="contact_form">
            <div className="flex flex-col xl:gap-y-4 gap-y-4 ">
              <h3 className="pb-2 text-lg font-bold text-left text-first xl:pb-4">
                Contactez-nous facilement via ce formulaire 🌿✉️
              </h3>
              <div className="flex justify-end">
                <div className="flex flex-col w-full xl:gap-y-4 gap-y-2 xl:w-full lg:w-2/3">
                  <div className="flex flex-col xl:flex-row gap-x-[30px] gap-y-2">
                    <div className="w-full">
                      <p
                        className={`${
                          fullNameError ? "block" : "hidden"
                        } text-third`}
                      >
                        {validateFullName(fullName).message}
                      </p>
                      <InputContactComponent
                        placeholder="Ex: John Doe"
                        label="Nom complet"
                        name="from_name"
                        value={fullName}
                        callBack={handleFullName}
                      />
                    </div>
                    <div className="w-full">
                      <p
                        className={`${
                          emailError ? "block" : "hidden"
                        } text-third`}
                      >
                        {validateEmail(email).message}
                      </p>
                      <InputContactComponent
                        placeholder="Ex: example@mail.com"
                        label="Email"
                        name="reply_to"
                        value={email}
                        callBack={handleEmail}
                      />
                    </div>
                  </div>
                  <p
                    className={`${
                      subjectError ? "block" : "hidden"
                    } text-third`}
                  >
                    {validateSubject(subject).message}
                  </p>
                  <InputContactComponent
                    placeholder="Ex:  comment participer ?"
                    label="Sujet"
                    name="subject"
                    value={subject}
                    callBack={handleSubject}
                  />
                  <p
                    className={`${
                      messageError ? "block" : "hidden"
                    } text-third`}
                  >
                    {validateMessage(message).message}
                  </p>
                  <RitchText
                    placeholder="Ecrivez votre message ici ..."
                    label="Message"
                    required
                    name="message"
                    value={message}
                    callBack={handleMessage}
                  />
                </div>
              </div>
              <div className="lg:w-[35%] lg:mx-auto xl:w-full">
                <p
                  className={`${recaptcha ? "block" : "hidden"} text-third`}
                ></p>
                <ReCAPTCHA
                  sitekey="6Lcwf5YpAAAAAOyhOApbW_Xnj1O1bVCM8WA_aLVK"
                  onChange={(value: any) => setRecaptcha(value)}
                />
              </div>
              <div className={`${loading ? "opacity-10 " : "opacity-100"} w-max`} onClick={loading ? ()=>{} : sendEmail}>
                  <HomeButton
                    title="Envoyer"
                    type="submit"
                    bg="bg-first"
                    color="text-white"
                    fontSize=" block w-full"
                  />
                </div>
              <div className="flex justify-end"></div>
            </div>
          </form>
          <div className="">
            <div className="flex flex-col items-start w-full xl:w-full lg:w-2/3 xl:gap-y-4 gap-y-2">
              <h3 className="pb-2 font-bold text-left xl:text-lg text-first xl:pb-4">
                via nos réseaux sociaux, notre équipe est impatiente de vous
                entendre et de faire de votre expérience théinoubliable. 🌿💬
              </h3>
              <ul className="flex justify-center w-full xl:gap-x-7 lg:justify-end gap-x-2">
                <li className="cursor-pointer">
                  <a href="#a">
                    <img
                      className="xl:w-[42px] w-[32px]"
                      src={instagram}
                      alt="Icon Instagram"
                    />
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a href="#d">
                    <img className="xl:w-[42px] w-[32px]" src={youtub} alt="Icon Youtube" />
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a href="#d">
                    <img
                      className="xl:w-[42px] w-[32px]"
                      src={facebook}
                      alt="Icon Facebook"
                    />
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a href="#a">
                    <img className="xl:w-[42px] w-[32px]" src={music} alt="Icon Tiktok" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
