import { useNavigate } from "react-router-dom";
import "./SideBar.scss"

const SideBar = () => {

    const navigate = useNavigate()

    return (
        <div className="SideBar">
            <div className="Navigator">
                <span className="NavigatorItem" onClick={() => navigate("/Exchange")}>Exchange</span>
                <span className="NavigatorItem" onClick={() => navigate("/Vault")}>Vault</span>
                <span className="NavigatorItem" onClick={() => navigate("/loan")}>Loan</span>
                <span className="NavigatorItem" onClick={() => navigate("/withdraw")}>Withdraw</span>
            </div>
        </div >
    )
}

export default SideBar