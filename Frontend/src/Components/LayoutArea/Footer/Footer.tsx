import "./Footer.css";

function Footer(): JSX.Element {
    const currentYear = new Date().getFullYear();

    return (
        <div className="Footer">
            <span>&copy; {currentYear} Sara Friedman 8457502@gmail.com. All Rights Reserved.</span>
        </div>
    );
}

export default Footer;
