import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AddClusterType, IReducers } from '../../Interfaces';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { setDarkMode } from '../../Store/actions';
import {
  addCluster,
  fetchUser,
  editUser,
  deleteUser,
  changeDarkMode,
  changeRefreshRate,
} from '../../Queries';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import './styles.css';

// Define the Admin type, setting types for the properties
// Associated with Admin accounts
type Admin = {
  cookieId: string;
  darkMode: boolean;
  firstName: string;
  lastName: string;
  password: string;
  refreshRate: number;
  username: string;
  _id: string;
};

// Create the Admin component
const Admin = (props: { refetch: any; handleAdminModal: any }) => {
  // Dispatch hook to dispatch actions to the store
  const dispatch = useAppDispatch();
  // Select the uiReducer from the store
  const uiReducer = useAppSelector((state: IReducers) => state.uiReducer);

  // React hooks to maintain local state
  const [updateUserErr, setUpdateUserErr] = useState('');
  const [deletePasswordErr, setDeletePasswordErr] = useState('');
  const [addClusterMessage, setAddClusterMessage] = useState('');
  const [currUser, setCurrUser] = useState<Admin | unknown>({});
  const darkMode = uiReducer.clusterUIState.darkmode;
  const [updateRefreshRateMessage, setUpdateRefreshRateMessage] = useState('');
  const [refreshRate, setRefreshRate] = useState(0);
  // mui tabs uses this to change tabs
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  // fetch Query
  const { data: userData, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });
  useEffect(() => {
    setCurrUser(userData);
    dispatch(setDarkMode(userData?.darkMode));
    setRefreshRate(userData?.refreshRate / 1000);
  }, [dispatch, userData]);

  // React query mutations used for requests other than get requests, used to get more efficient requests
  const mutation = useMutation((data: AddClusterType) => addCluster(data), {
    onSuccess: (response) => {
      response.success
        ? setAddClusterMessage('Successfully added cluster')
        : setAddClusterMessage(response.message);
      props.refetch();
      props.handleAdminModal(false);
    },
  });
  const userMutation = useMutation(
    (data: { username: string; firstName: string; lastName: string }) =>
      editUser(data),
    {
      onSuccess: (response) => {
        response.success
          ? setUpdateUserErr('Account information successfully updated')
          : setUpdateUserErr('Your account details could not be updated');
      },
    }
  );
  const userDeleteMutation = useMutation(
    (body: { username: string; password: string }) => deleteUser(body),
    {
      onSuccess: (response) => {
        response.deleted
          ? navigate('/')
          : setDeletePasswordErr('Incorrect password');
      },
    }
  );
  const darkModeMutation = useMutation(
    (data: { darkMode: boolean }) => changeDarkMode(data),
    {
      onSuccess: (response) => {
        response.success
          ? dispatch(setDarkMode(!darkMode))
          : console.log('Dark mode could not be enabled');
      },
    }
  );
  const refreshRateMutation = useMutation(
    (data: { refreshRate: number }) => changeRefreshRate(data),
    {
      onSuccess: (response) => {
        console.log(response, 'responseresponseresponseresponseresponse');
        if (response.success) {
          refetch();
          setUpdateRefreshRateMessage(
            `Refresh rate successfully set to ${
              userData.refreshRate / 1000
            } seconds`
          );
        } else setUpdateRefreshRateMessage('Refresh rate could not be updated');
      },
    }
  );
  // Styles
  const containerStyle = {
    width: '350px',
    marginTop: '-10px',
  };
  const textFieldStyle = {
    background: '#FFFFFF',
    borderRadius: '5px',
    marginBottom: '0px',
    width: '100%',
    fontSize: '10px',
  };
  const buttonStyle = {
    background: '#3a4a5b',
    borderRadius: '5px',
    marginBottom: '0px',
    width: '100%',
    fontSize: '10px',
  };
  // handler functions
  const handleAddCluster = async (): Promise<void> => {
    try {
      const body = {
        url: (document.getElementById('cluster-url') as HTMLInputElement).value,
        k8_port: (document.getElementById('k8_port') as HTMLInputElement).value,
        faas_port: (document.getElementById('faas_port') as HTMLInputElement)
          .value,
        faas_username: (
          document.getElementById('faas_username') as HTMLInputElement
        ).value,
        faas_password: (
          document.getElementById('faas_password') as HTMLInputElement
        ).value,
        name: (document.getElementById('cluster-name') as HTMLInputElement)
          .value,
        description: (
          document.getElementById('cluster-description') as HTMLInputElement
        ).value,
        faas_url: (document.getElementById('openfaas-url') as HTMLInputElement)
          .value,
        grafana_url: (
          document.getElementById('grafana-url') as HTMLInputElement
        ).value,
        kubeview_url: (
          document.getElementById('kubeview-url') as HTMLInputElement
        ).value,
      };
      if (
        !body.url ||
        !body.k8_port ||
        !body.faas_port ||
        !body.name ||
        !body.description ||
        !body.faas_url ||
        !body.grafana_url ||
        !body.kubeview_url
      ) {
        setAddClusterMessage('Missing input fields');
        return;
      }
      if (!body.k8_port.match(/[0-9]/g) || !body.faas_port.match(/[0-9]/g)) {
        setAddClusterMessage('Port(s) must be numbers');
        return;
      }
      mutation.mutate(body);
    } catch (err) {
      console.log('Add cluster failed', err);
    }
  };

  const handleUserUpdate = async (): Promise<void> => {
    try {
      const body = {
        username: (
          document.getElementById('update-username-input') as HTMLInputElement
        ).value,
        firstName: (
          document.getElementById('update-firstName-input') as HTMLInputElement
        ).value,
        lastName: (
          document.getElementById('update-lastName-input') as HTMLInputElement
        ).value,
      };
      if (!body.username && !body.firstName && !body.lastName) {
        setUpdateUserErr('No inputs in input fields');
        return;
      }
      if (!body.username) body.username = userData.username;
      if (!body.firstName) body.firstName = userData.firstName;
      if (!body.lastName) body.lastName = userData.lastName;

      userMutation.mutate(body);
    } catch (err) {
      console.log('Update request to server failed', err);
    }
  };

  const handleUserDelete = async (): Promise<void> => {
    try {
      const userBody = {
        username: currUser.username,
        password: (
          document.getElementById('delete-password-input') as HTMLInputElement
        ).value,
      };
      userDeleteMutation.mutate(userBody);
    } catch (err) {
      console.log('Delete request to server failed', err);
    }
  };

  const handleDarkMode = async (): Promise<void> => {
    try {
      const body = {
        darkMode: !darkMode,
      };
      darkModeMutation.mutate(body);
    } catch (err) {
      console.log('Update request to server failed', err);
    }
  };

  const handleRefreshRate = async (): Promise<void> => {
    try {
      const body = {
        refreshRate:
          Number(
            (document.getElementById('refresh-rate-input') as HTMLInputElement)
              .value
          ) * 1000,
      };
      refreshRateMutation.mutate(body);
    } catch (err) {
      console.log('Update request to server failed', err);
    }
  };

  const handleEnterKeyDownUpdate = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') handleUserUpdate();
  };

  const handleEnterKeyDownDelete = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') handleUserDelete();
  };

  const handleEnterKeyDownAddCluster = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') handleAddCluster();
  };

  const handleEnterKeyDownRefreshRate = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') handleRefreshRate();
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Implementing MUI tabs
  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div id="HomeContainer">
      <Container
        className={'Admin-Modal-Container'}
        sx={{
          color: 'white',
          minHeight: '65%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgb(0,0,0)',
          boxShadow: '1px 1px 10px .5px #403e54',
          borderRadius: '0px',
          marginBottom: '20px',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{
                color: '#FFF',
              }}
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#2074FF',
                },
              }}
              centered
            >
              <Tab
                label="Account Details"
                {...a11yProps(0)}
                sx={{
                  color: '#FFF',
                }}
              />
              <Tab
                label="Add Cluster"
                {...a11yProps(1)}
                sx={{
                  color: '#FFF',
                }}
              />
              <Tab
                label="About"
                {...a11yProps(2)}
                sx={{
                  color: '#FFF',
                }}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Container sx={containerStyle}>
              <TextField
                onKeyDown={handleEnterKeyDownUpdate}
                autoComplete="current-password"
                id="update-username-input"
                type="username"
                label="Username"
                variant="filled"
                size="small"
                margin="dense"
                sx={textFieldStyle}
              />

              <TextField
                onKeyDown={handleEnterKeyDownUpdate}
                autoComplete="current-password"
                id="update-firstName-input"
                type="firstName"
                label="First Name"
                variant="filled"
                size="small"
                margin="dense"
                sx={textFieldStyle}
              />

              <TextField
                onKeyDown={handleEnterKeyDownUpdate}
                autoComplete="current-password"
                id="update-lastName-input"
                type="userName"
                label="Last Name"
                variant="filled"
                size="small"
                margin="dense"
                sx={textFieldStyle}
              />
              <div>
                <Button
                  variant="contained"
                  className="btn"
                  type="button"
                  onClick={handleUserUpdate}
                  sx={buttonStyle}
                >
                  Update Admin Details
                </Button>
                <span id="update-user-err">{updateUserErr}</span>
              </div>

              <TextField
                onKeyDown={handleEnterKeyDownDelete}
                id="delete-password-input"
                type="password"
                label="Enter Password to Confirm Deletion"
                variant="filled"
                size="small"
                margin="dense"
                sx={textFieldStyle}
              />
              <div>
                <Button
                  id="delete-password-input"
                  variant="contained"
                  className="btn"
                  type="button"
                  onClick={handleUserDelete}
                  sx={buttonStyle}
                >
                  Delete
                </Button>
                <span id="delete-password-err">{deletePasswordErr}</span>
              </div>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Container sx={containerStyle}>
              <TextField
                id="cluster-url"
                type="text"
                label="Cluster URL"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              <TextField
                id="k8_port"
                type="text"
                label="Kubernetes Port"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              <TextField
                id="faas_port"
                type="text"
                label="FaaS Port"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              <TextField
                id="faas_username"
                type="username"
                label="FaaS Username"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              <TextField
                id="faas_password"
                type="password"
                label="FaaS Password"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              <TextField
                id="cluster-name"
                type="text"
                label="Cluster Name"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              <TextField
                id="cluster-description"
                type="text"
                label="Cluster Description"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              <TextField
                id="openfaas-url"
                type="text"
                label="FaaS URL"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              <TextField
                id="grafana-url"
                type="text"
                label="Grafana URL"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              <TextField
                id="kubeview-url"
                type="text"
                label="Kubeview URL"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              <div>
                <Button
                  variant="contained"
                  className="btn"
                  type="button"
                  onClick={handleAddCluster}
                  sx={buttonStyle}
                >
                  Add Cluster
                </Button>
                <div id="add-cluster-msg">{addClusterMessage}</div>
              </div>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Container sx={containerStyle}>
              <Button
                variant="contained"
                type="button"
                className="btn"
                sx={buttonStyle}
                onClick={() =>
                  window.open(
                    'https://vaas.dev/',
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
              >
                Learn about the project
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <h3>Developed by:</h3>
                <p>Young Kim</p>
                <p>Ahsan Ali </p>
                <p>Rabea Ahmad</p>
                <p>Stephan Chiorean</p>
                <p>Ruqayaah Sabitu</p>
                <p>James Chan</p>
                <p>Jimmy Lim</p>
                <p>Alex Kaneps</p>
                <p>Matthew McGowan</p>
                <p>Vu Duong</p>
                <p>Murad Alqadi</p>
                <p>Kevin Le</p>
                <p>Richard Zhang</p>
                <p>Irvin Ie</p>
              </Box>
            </Container>
          </TabPanel>
        </Box>
      </Container>
    </div>
  );
};

export default Admin;
