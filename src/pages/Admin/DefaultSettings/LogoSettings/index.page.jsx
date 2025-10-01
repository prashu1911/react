import { DEFAULT_SETTINGS } from "apiEndpoints/DefaultSettings";
import { ImageElement, InputField, Loader } from "components";
import { useAuth } from "customHooks";
import { showSuccessToast } from "helpers/toastHelper";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { commonService } from "services/common.service";

export default function LogoSettings({
  setActiveTab,
  activeTab,
  companyId,
  setIsUpdateAllSetting,
}) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [isImgUpload, setIsImgUpload] = useState(false);

  const handleLogoChange = async (e) => {
    if (e.target.files.length > 0) {
      setIsImgUpload(true);
      try {
        const bodyData = {
          company_master_id: userData?.companyMasterID,
          company_id: companyId,
          file: e.target.files[0],
        };
        const response = await commonService({
          apiEndPoint: DEFAULT_SETTINGS.updateDefaultSettingLogo,
          bodyData,
          isFormData: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userData?.apiToken}`,
          },
        });
        if (response?.data) {
          showSuccessToast("logo uploaded successfully!");
          setIsUpdateAllSetting((p) => !p);
          e.target.files = null;
        }
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          setIsImgUpload(false);
        }, [3200]);
      }
    }
  };

  return (
    <>
      <div
        id="logoSettingsTab"
        onClick={()=> {
          setActiveTab("logoSettingsTab");
      }}
      >
        <div className="pageTitle">
          <h2>Logo Settings </h2>
        </div>
        <div className="generalsetting_inner d-block">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Logo Settings </Accordion.Header>
              <Accordion.Body>
                {isImgUpload ? (
                  <Loader />
                ) : (
                  <div className="uploadImg">
                    <div>
                      <label htmlFor="imageuploads" className="uploadImg_btn">
                        <ImageElement
                          previewSource={
                            userData?.logo ||
                            "../../assets/admin-images/default-img.jpg"
                          }
                        />

                        <a href="#!" className="ms-0">
                          <em className="icon-camera" />
                        </a>
                      </label>
                      <InputField
                        onChange={handleLogoChange}
                        type="file"
                        className="d-none"
                        id="imageuploads"
                        name="imageuploads"
                        accept=".jpg, .jpeg, .png"
                      />
                    </div>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </>
  );
}
