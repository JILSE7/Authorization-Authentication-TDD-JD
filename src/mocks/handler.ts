import { ResponseResolver, rest } from 'msw';

export const handlers = [
    // Handles a POST /login request
    rest.post('/login',(req, res, ctx) => {
        //console.log("entre al login");
        // Persist user's authentication in the session
        sessionStorage.setItem('is-authenticated', 'true')
        let role = 'user';
        let username = 'otherEmployee';

        const {email} = req.body as {email:string, password:string};
        //console.log(email);
        if(email === 'saidnnnn@gmail.com'){
            role = 'admin';
            username = 'Jhonh dhoe'
        }
        return res(
          // Respond with a 200 status code
          ctx.status(200), ctx.json({user:{role, username}})
        )
      }),
]


export const errorHandler = (wrongeEmail: string , wrongPassword: string) => {
    return rest.post('/login',(req, res, ctx) => {
        const {email , password} = req.body as {email:string, password: string}
        if( email === wrongeEmail && password === wrongPassword ){
            //Return for BadRequest
            return res(ctx.status(401), 
                        ctx.json({message: 'Bad credencials'}))
        };
        
            //Return for NiceRequest
            return res(ctx.status(200));

    })
}