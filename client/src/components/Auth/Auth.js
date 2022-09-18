import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Icon from './icon';
import { signin, signup } from '../../actions/auth';
import { AUTH } from '../../constants/actionTypes';
import useStyles from './styles';
import Input from './Input';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const SignUp = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword(!showPassword);

    const switchMode = () => {
        setForm(initialState);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const recovery = () => {

    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup) {
            dispatch(signup(form, history));
        } else {
            dispatch(signin(form, history));
        }
    };

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({ type: AUTH, data: { result, token } });

            history.push('/');
        } catch (error) {
            console.log(error);
        }
    };

    const googleError = () => alert('Не удалось осуществить вход с помощью Google. Попробуйте позже');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">{ isSignup ? 'Зарегистрироваться' : 'Войти' }</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        { isSignup && (
                            <>
                                <Input name="firstName" label="Имя" handleChange={handleChange} autoFocus half />
                                <Input name="lastName" label="Фамилия" handleChange={handleChange} half />
                            </>
                        )}
                        <Input name="email" label="Email" handleChange={handleChange} type="email" />
                        <Input name="password" label="Пароль" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        { isSignup && <Input name="confirmPassword" label="Повторите пароль" handleChange={handleChange} type="password" /> }
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        { isSignup ? 'Зарегистрироваться' : 'Войти' }
                    </Button>
                    <GoogleLogin
                        clientId="836034601030-6nb0idka0o3ks220ve5m563q4s34545l.apps.googleusercontent.com"
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                                Войти c помощью Google
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleError}
                        cookiePolicy="single_host_origin"
                    />
                    <Grid container justify="center">
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup ? "Уже есть аккаунт? Войдите" : "Всё ещё нет аккаунта? Зарегистрируйтесь!" }
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container justify="center">
                        <Grid item>
                            <Button onClick={recovery}>
                                { isSignup ? "Забыли пароль?" : "Проблемы со входом"}
                            </Button>
                        </Grid>
                    </Grid>

                </form>
            </Paper>
        </Container>
    );
};

export default SignUp;
