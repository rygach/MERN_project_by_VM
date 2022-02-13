import React from "react";
import { useState, useEffect } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const AuthPage = () => {
    const message = useMessage();
    // self-made hook, for working with HTTP-requests
    const { loading, request, error, clearError } = useHttp();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError])

    const changeHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }
    
    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', { ...form });
            message(data.message);
        } catch (e) {
            
        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Сократи ссылку</h1>
                <div className="card darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Card Title</span>
                        <div>
                            <div className="input-field">
                                <input
                                    placeholder="Введите почту"
                                    id="email"
                                    type="text"
                                    name="email"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="email" className="active">Почта</label>
                            </div>
                            <div className="input-field">
                                <input
                                    placeholder="Введите пароль"
                                    id="password"
                                    type="password"
                                    name="password"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="password" className="active">Пароль</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn btn_sign_in yellow darken-4"
                            disabled={loading}
                        >
                            Sign In
                        </button>
                        <button
                            className="btn grey lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}