export class ApiService{


    async static get() {
        try{
            const url = await fetch(endpoint)

            const data = await url.json();

            return data;
        }catch(error){
            console.log('Ocorreu um erro:')
        }
    }


    async static post(endpoint, payload){
        try{
            const url = await fetch(endpoint, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                BODY: JSON.stringify(payload)
            })

            const dados = await url.JSON();

            return data;


         } catch (error) {
            console.log('Ocorreu um erro:', error);
        }
    }

}
