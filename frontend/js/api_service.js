class ApiService{


     static async get(endpoint) {
        try{
            const Response = await fetch(endpoint)

            const data = await Response.json();

            return data;
        }catch(error){
            console.log('Ocorreu um erro:')
        }
    }


    static async  post(endpoint, payload){
        try{
            const Response = await fetch(endpoint, {
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                BODY: JSON.stringify(payload)
            })

            return await Response.JSON();
         } catch (error) {
            console.error(`Erro na requisição para ${endpoint}:`, error);
            throw new Error('Servidor offline ou erro de rede.');
        }
    }

}

export default ApiService;
