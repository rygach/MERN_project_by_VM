import React from "react"
import { Routes, Route, Navigate } from 'react-router-dom';
import { CreatePage } from "./pages/CreatePage";
import { DetailPage } from "./pages/DetailPage";
import { LinksPage } from "./pages/LinksPage";
import { AuthPage } from "./pages/AuthPage";

export const useRoutes = isAuthenficated => {
    if (isAuthenficated) {
        return (
            <Routes>
                <Route path='/links' exact element={< LinksPage />} />
                <Route path='/create' exact element={< CreatePage />} />
                <Route path='/detail/:id' element={< DetailPage />} />
                <Route path='*' element={< CreatePage />} />
            </Routes>
        )
    }

    return (
        <Routes>
            <Route path='*' exact element={< AuthPage />} />
        </Routes>
)
}

