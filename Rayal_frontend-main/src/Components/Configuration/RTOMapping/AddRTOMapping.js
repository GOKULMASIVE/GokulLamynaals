import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FloatLabel from "../../../UiComponents/FloatLabel/FloatLabel";
import { Formik, Form, Field } from "formik";
import { GetCompany, GetRTO, PostRTO, UpdateCompanyRTO } from "../../../Service/_index";
import CloseIcon from "@mui/icons-material/Close";
import { ToastError, ToastSuccess } from "../../../UiComponents/Toaster/Toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Checkbox, Collapse } from 'antd';
const AddRTOMapping = (props) => {
  const { selectedData, formType, setOpenBranchDrawer, setSelectedData, GetData } = props;
  let formRef = useRef();

  const initialValues = {
    companyId: "",
    location: "",
    remarks: ''
  };

  const UserId = localStorage.getItem("UserId");
  const [RTODetails, setRTODetails] = useState([])
  const [companyDetails, setCompanyDetails] = useState([])
  useEffect(() => {
    if (formType === "edit") {
      Object.keys(initialValues).forEach((el) => {
        initialValues[el] = selectedData[el];
      });
    }
    formRef.setFieldValue(initialValues);
  }, []);

  const GetCompanyDetails = async () => {
    try {
      const res = await GetCompany({ isAscending: true });
      const modifiedCompany = res.data.map((e) => {
        if (e.isEnabled) {

          return {
            ...e,
            label: e.shortName,
            value: e._id,
          };
        } else {
          return null;
        }
      });
      
      setCompanyDetails(modifiedCompany.filter(Boolean));
    } catch (error) {
      console.error(error);
    }
  };


  const GetRTODetails = () => {
    GetRTO().then((res) => {
      setRTODetails(res.data);
    }).catch((err) => {
      console.log(err)
    })
  }
  useEffect(() => {
    GetCompanyDetails()
    GetRTODetails()
  }, [])


  const UserName = localStorage.getItem("UserId")
  const onSubmit = (data) => {
    data.RTOCode = selectedRTOs
    const CurrentDate = new Date()
    if (formType === "edit") {
      data.updatedBy = UserName
      data.updatedAt = CurrentDate
    }
    else {
      data.createdBy = UserName
    }
    const ApiType = formType === 'edit' ? UpdateCompanyRTO(selectedData._id, data) : PostRTO(data)
    ApiType.then((res) => {
      GetData()
      if (!res) {
        setOpenBranchDrawer(true);
      } else {
        setOpenBranchDrawer(false);
      }
    }).catch((err) => {
      ToastError("Something went wrong")
    })
  };

  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedRTOs, setSelectedRTOs] = useState(formType === 'edit' ? selectedData.RTOCode : []);
  const [companyValue, setCompanyValue] = useState(
    formType === "edit" ? selectedData.company.value : null
  );


  const handleRegionChange = (regionId) => {
    const updatedSelectedRegions = selectedRegions.includes(regionId)
      ? selectedRegions.filter((id) => id !== regionId)
      : [...selectedRegions, regionId];
    setSelectedRegions(updatedSelectedRegions);

    const region = RTODetails.find((item) => item._id === regionId);
    const rtoValues = region.RTO.map((rto) => rto.id) || [];
    if (updatedSelectedRegions.includes(regionId)) {
      setSelectedRTOs([...selectedRTOs, ...rtoValues]);
    } else {
      setSelectedRTOs(selectedRTOs.filter((rto) => !rtoValues.includes(rto)));
    }
  };

  const handleRTOChange = (rtoId) => {
    const regionId = RTODetails.find((item) => item.RTO.some((rto) => rto.id === rtoId))?._id;

    if (regionId) {
      const allRTOs = RTODetails.find((item) => item._id === regionId)?.RTO.map((rto) => rto.id) || [];
      const updatedSelectedRTOs = selectedRTOs.includes(rtoId)
        ? selectedRTOs.filter((id) => id !== rtoId)
        : [...selectedRTOs, rtoId];

      setSelectedRTOs(updatedSelectedRTOs);

      if (updatedSelectedRTOs.length === allRTOs.length) {
        setSelectedRegions((prevSelectedRegions) => [
          ...prevSelectedRegions,
          regionId,
        ]);
      } else {
        setSelectedRegions((prevSelectedRegions) =>
          prevSelectedRegions.filter((id) => id !== regionId)
        );
      }
    }
  };


  const { Panel } = Collapse
  const [searchText, setSearchText] = useState('');
  const filteredRTODetails = RTODetails?.filter((region) =>
    region._id.toLowerCase().includes(searchText.toLowerCase())
  );


  return (
    <>
      <div className="MainRenderinContainer">
        <Grid container className="DrawerHeader">
          <Grid item xs={6} sm={6}>
            <Typography>RTO Mapping</Typography>
          </Grid>
          <Grid item xs={6} sm={6} className="d-flex justify-content-end">
            <CloseIcon
              onClick={() => setOpenBranchDrawer(false)}
              sx={{ cursor: "pointer" }}
            />
          </Grid>
        </Grid>
        <div className="container-fluid">
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              onSubmit(values);
            }}
            innerRef={(ref) => {
              if (ref) {
                formRef = ref;
              }
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Grid container rowSpacing={1}>

                  <Grid item xs={12} sm={12}>
                    <FloatLabel label="Company Name" value={companyValue}>
                      <Autocomplete
                        name="companyId"
                        className="AutoComplete_InputBox"
                        options={companyDetails}
                        value={companyValue}
                        renderInput={(params) => <TextField {...params} />}
                        isOptionEqualToValue={(option, value) =>
                          option?._id === value?._id
                        }
                        onChange={(e, v) => {
                          setCompanyValue(v?.shortName)
                          setFieldValue('companyId', v?._id)
                        }
                        }

                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FloatLabel label="Location" value={values.location}>
                      <Field
                        name="location"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FloatLabel label="Remarks" value={values.remarks}>
                      <Field
                        name="remarks"
                        className="InputFiled"
                        style={{ textTransform: "uppercase" }}
                      />
                    </FloatLabel>
                  </Grid>

                  <Grid item xs={12} sm={12} >
                    <Collapse expandIconPosition={'end'} collapsible={'icon'} style={{ borderRadius: '5px' }} className="w-100" >
                      <Panel style={{ borderRadius: '5px' }} header={
                        <>
                          {/* <Checkbox
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                          /> */}
                          Select State</>
                      }>
                        <TextField className="w-100" placeholder="Search state ..." onChange={(e) => setSearchText(e.target.value)}
                          sx={{
                            border: 'none', outline: 'none', '&:focus': {
                              outline: 'none',
                              border: 'none'
                            }
                          }}
                        ></TextField>

                        {filteredRTODetails?.map((region, i) => (
                          <Collapse style={{ borderRadius: 0, border: 'none' }} expandIconPosition={'end'} collapsible={'icon'} >
                            <Panel style={{ borderRadius: '0px' }} header={
                              <div style={{ paddingLeft: '20px' }}>
                                <Checkbox
                                  checked={selectedRegions.includes(region._id)}
                                  onChange={() => handleRegionChange(region._id)}
                                />&nbsp;&nbsp;{region._id}</div>
                            } key={i}
                            >

                              <Grid container sx={{ width: '100%', padding: '10px 10px 10px 70px' }} spacing={2}>
                                {region.RTO.map((rto, index) => (
                                  <Grid item xs={12} sm={6} key={index} >
                                    <Checkbox
                                      checked={selectedRTOs.includes(rto.id)}
                                      onChange={() => handleRTOChange(rto.id)}
                                    />&nbsp;&nbsp;{rto.value}</Grid>
                                ))}
                              </Grid>

                            </Panel>
                          </Collapse>
                        ))}
                      </Panel>
                    </Collapse>
                  </Grid>
                  {/* <Grid xs={12} sm={12}>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAllChange}
                        />
                        ALLSTATE
                      </label>
                      {RTODetails?.map((region) => (
                        <div key={region._id}>
                          <label>
                            <input
                              type="checkbox"
                              checked={selectedRegions.includes(region._id)}
                              onChange={() => handleRegionChange(region._id)}
                            />
                            {region._id}
                          </label>
                          <div>
                            {region.RTO.map((rto) => (
                              <div key={rto.id} style={{ marginLeft: '20px' }}>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={selectedRTOs.includes(rto.id)}
                                    onChange={() => handleRTOChange(rto.id)}
                                  />
                                  {rto.value}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Grid> */}
                  <Grid className="DrawerFooter" item xs={12} sm={12} gap={1}>
                    <button onClick={() => setOpenBranchDrawer(false)}>
                      Cancel
                    </button>
                    <button type="submit">
                      {selectedData?._id ? "Update" : "Save"}
                    </button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AddRTOMapping;



// checked={selectedData.RTOCode.includes(items.value)}