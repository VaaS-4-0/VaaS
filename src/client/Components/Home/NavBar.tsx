import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IReducers } from '../../Interfaces/IReducers';
import { Get } from '../../Services';

import { setTitle, signIn } from '../../Store/actions';
import { apiRoute } from '../../utils';

const NavBar = () => {
  const navBarReducer = useSelector((state: IReducers) => state.navBarReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    dispatch(signIn({
      signInState: false,
      username: ''
    }));
    navigate('/');
  };

  const dropdown = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate('/' + e.target.value.toLowerCase());
  };

  return (
    <div id='navbar'>
      <span>{navBarReducer.title}</span>
      <button className='btn' id='logout-btn' onClick={handleLogOut}>Logout</button>
      <select id='dropdown' defaultValue='test' onChange={dropdown}>
        <option value='test' disabled hidden>Dropdown</option>
        <option value='Home'>Home</option>
        <option value='Settings'>Settings</option>
        <option value='Visualizer'>Visualizer</option>
      </select>
      <span id='username-navbar'>{'Username: ' + localStorage.getItem('username')}</span>
    </div>
  );
};

export default NavBar;
