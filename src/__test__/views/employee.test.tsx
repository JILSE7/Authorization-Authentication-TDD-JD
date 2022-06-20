import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { ReactElement, JSXElementConstructor } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AppRouter from '../../router/AppRouter';

const renderWithRouter = (ui:ReactElement<any, string | JSXElementConstructor<any>>, route:string) => {
    window.history.pushState({},'Test page', route);

    return render(ui)
}

describe('When the admin access to employee page', () => { 
    
    test('Must have access delete button', async() => { 
        renderWithRouter(<AuthContext.Provider value={{userState:{user:{role:'admin', username: 'Jhonh dhoe'}, isAuth:true}, dispatch: () => {}}}>
                             <AppRouter/>
                        </AuthContext.Provider>, '/employee'
        );
        expect(screen.getByRole('button',{name:/delete/i})).toBeInTheDocument();
    });
});

describe('When the employee access to employee page', () => { 
    
    test('Must have not access delete button', async() => { 
        renderWithRouter(<AuthContext.Provider value={{userState:{user:{role:'user', username: 'Jhonh dhoe'}, isAuth:true}, dispatch: () => {}}}>
                             <AppRouter/>
                        </AuthContext.Provider>, '/employee'
        );
        expect(screen.queryByRole('button',{name:/delete/i})).toBeFalsy()
    });
});

describe('When the employee access to employee page', () => { 
    
    test('Must show his user name', async() => { 
        renderWithRouter(<AuthContext.Provider value={{userState:{user:{role:'user', username: 'Pepe Maldonado'}, isAuth:true}, dispatch: () => {}}}>
                             <AppRouter/>
                        </AuthContext.Provider>, '/employee'
        );
        expect(screen.queryByRole('button',{name:/delete/i})).toBeFalsy()
        expect(screen.getByText(/pepe/i)).toBeInTheDocument();

    });
});