import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { Checkbox, Collapse } from 'antd';
import { CSVLink } from "react-csv";
import Button from "@mui/material/Button";
import { DownloadIcon } from "../../../Resources/Icons/icons";
import Menu from "./Menu";
const { Panel } = Collapse;

const DownloadReport = (props) => {
  const { setOpenDrawer, excelData, header } = props;
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectSubMenu, setSelectSubMenu] = useState(header);
  const handleRegionChange = (regionId) => {
    const updatedSelectedRegions = selectedRegions.includes(regionId)
      ? selectedRegions.filter((id) => id !== regionId)
      : [...selectedRegions, regionId];
    setSelectedRegions(updatedSelectedRegions);

    const region = Menu.find((item) => item._id === regionId);
    const submenuValues = region.Submenu || [];
    if (updatedSelectedRegions.includes(regionId)) {
      setSelectSubMenu((prevSelectSubMenu) => [
        ...prevSelectSubMenu,
        ...submenuValues.map((submenu) => ({ label: submenu.label, key: submenu.key })),
      ]);
    } else {
      setSelectSubMenu((prevSelectSubMenu) =>
        prevSelectSubMenu.filter(
          (submenu) => !submenuValues.some((item) => item.key === submenu.key)
        )
      );
    }
  };

  const handleRTOChange = (rtoKey) => {
    const regionId = Menu.find((item) =>
      item.Submenu.some((rto) => rto.key === rtoKey)
    )?._id;

    if (regionId) {
      const allRTOs = Menu.find((item) => item._id === regionId)?.Submenu || [];
      const updatedSelectedRTOs = selectSubMenu.some(
        (rto) => rto.key === rtoKey
      )
        ? selectSubMenu.filter((item) => item.key !== rtoKey)
        : [
          ...selectSubMenu,
          allRTOs.find((rto) => rto.key === rtoKey),
        ];

      setSelectSubMenu(updatedSelectedRTOs);

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


  const csvFile = {
    filename: "Master Report All Data",
    headers: selectSubMenu,
    data: excelData.filter(Boolean),
  };

  return (
    <div className="MainRenderinContainer">
      <Grid container className="DrawerHeader">
        <Grid item xs={6} sm={6}>
          <Typography>Filter Report</Typography>
        </Grid>
        <Grid item xs={6} sm={6} className="d-flex justify-content-end">
          <CloseIcon
            onClick={() => setOpenDrawer(false)}
            sx={{ cursor: "pointer" }}
          />
        </Grid>
      </Grid>
      <div className="container-fluid">
        <Grid container sx={{ width: '100%' }}>
          {Menu?.map((main, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Collapse style={{ borderRadius: 0, border: 'none' }} expandIconPosition={'end'} collapsible={'icon'} >
                <Panel style={{ borderRadius: '0px' }} header={
                  <div style={{ paddingLeft: '20px' }}>
                    <Checkbox
                      checked={selectedRegions.includes(main._id)}
                      onChange={() => handleRegionChange(main._id)}
                    />&nbsp;&nbsp;{main._id}
                  </div>
                } key={i}>
                  <Grid container sx={{ width: '100%', padding: '10px 10px 10px 70px' }} spacing={2}>
                    {main.Submenu.map((subMain, index) => (
                      <Grid item xs={12} sm={12} key={index} >
                        <Checkbox
                          checked={selectSubMenu.some((item) => item.key === subMain.key)}
                          onChange={() => handleRTOChange(subMain.key)}
                        />&nbsp;&nbsp;{subMain.label}
                      </Grid>
                    ))}
                  </Grid>
                </Panel>
              </Collapse>
            </Grid>
          ))}
          <Grid item xs={12} sm={12} className="Master_Header_Container">
            <Button
              className="Master_Header_create_Button w-100"
              endIcon={<DownloadIcon />}
              sx={{ width: { xs: "100%", sm: "fit-content" } }}
            >
              <CSVLink className="Download_Excel_Button" {...csvFile}>
                Download Excel
              </CSVLink>
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default DownloadReport;
