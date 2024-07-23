//@ts-nocheck
import { FC } from "react";
import loginImage from "@doar/shared/images/img16.png";
import ContactUsFrom from "../../components/contactus-form";
import {
    StyledMedia,
    StyledMapContainer,
    StyledTitle,
    StyledDesc,
    StyledSignin,
    StyledTitleMin,
    StyledDescItalic
} from "./style";
import * as DoarComponents from "@doar/components";


console.log("DoarComponents", DoarComponents)

const ContactUsContainer: FC = () => {
    return (
        <StyledMedia>
            <StyledSignin>
                <ContactUsFrom />
            </StyledSignin>
            <StyledMapContainer>
                <StyledTitleMin>Address</StyledTitleMin>
                <StyledDescItalic>
                    Kümbet, Muhsin Yazıcıoğlu Blv.
                </StyledDescItalic>
                <StyledDescItalic>
                    No: 64, 58020 merkez/Sivas
                </StyledDescItalic>

                <br></br>

                <StyledTitleMin> </StyledTitleMin>
                <StyledDescItalic>

                </StyledDescItalic>
                <StyledDescItalic>

                </StyledDescItalic>
                {/* 
                <GoogleMap height={["300px", "400px"]} width="100%" lat={-12.043333} lng={-77.028333}>
                    <GoogleMapMarker />
                </GoogleMap> */}




                <br></br>
                {/* <iframe
                    height="300"
                    width="300"
                    class="gmap_iframe"
                    frameborder="0"
                    scrolling="no"
                    marginheight="0"
                    marginwidth="0"
                    src="https://maps.google.com/maps?width=600&amp;height=600&amp;hl=en&amp;q=Ankara, odtü teknokent&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe> */}


                        <iframe 
                        width="300" 
                        height="300" 
                        id="gmap_canvas" 
                        src="https://maps.google.com/maps?q=Interra%20yap%C4%B1&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                        frameborder="0" 
                        scrolling="no" 
                        marginheight="0" 
                        marginwidth="0">
                            </iframe>



                {/* <StyledImage>
                    <img src={loginImage} alt="Login" />
                </StyledImage> */}
                {/* <StyledImgText>
                    Workspace design vector is created by{" "}
                    <a
                        href="https://www.freepik.com/pikisuperstar"
                        target="_blank"
                        rel="noreferrer"
                    >
                        pikisuperstar (freepik.com)
                    </a>
                </StyledImgText> */}
            </StyledMapContainer>
        </StyledMedia>
    );
};

export default ContactUsContainer;
