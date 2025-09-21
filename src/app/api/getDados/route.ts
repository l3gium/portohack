import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {   
    const praticagemData = await getPraticagem();
    const agenciaMaritimaData = await getAgenciaMaritima();
    const autoridadePortuariaData = await getAutoridadePortuaria();

    const merged: Record<
    string,
    {
        identificadorNavio: string;
        praticagem?: any;
        agenciaMaritima?: any;
        autoridadePortuaria?: any;
    }
    > = {};

    function mergeData(arr: any[], key: "praticagem" | "agenciaMaritima" | "autoridadePortuaria") {
    arr.forEach((item) => {
        const id = item.identificadorNavio;
        if (!merged[id]) merged[id] = { identificadorNavio: id };
        
        merged[id][key] = item;
    });
    }

    mergeData(praticagemData.data, "praticagem");
    mergeData(agenciaMaritimaData.data, "agenciaMaritima");
    mergeData(autoridadePortuariaData.data, "autoridadePortuaria");

    const result = Object.values(merged);

    console.log("Dados consolidados:", result);

    return NextResponse.json({ data: result, total: result.length });
}

async function getPraticagem(){
    const url = 'https://api.hackathon.souamigu.org.br/praticagem';
    const options = {method: 'GET'};

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function getAgenciaMaritima() {
    const url = 'https://api.hackathon.souamigu.org.br/agencia-maritima';
    const options = {method: 'GET'};

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function getAutoridadePortuaria() {
    const url = 'https://api.hackathon.souamigu.org.br/autoridade-portuaria';
    const options = {method: 'GET'};

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error(error);
    }    
}