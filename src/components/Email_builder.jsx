import Navbar from "./Navbar"
import Builder from "./Builder"
import { ToastContainer } from "react-toastify"

function Email_builder (){

    return (
        <div className="">
            <Navbar />
            <Builder />
            <ToastContainer />
        </div>
    )
}

export default Email_builder;