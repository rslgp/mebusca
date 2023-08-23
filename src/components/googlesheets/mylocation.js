import React, { Component } from 'react';

import CircularProgress from '@mui/material/CircularProgress';

import envVariables from '../variaveisAmbiente';

const { GoogleSpreadsheet } = require('google-spreadsheet');


// Google Sheets Document ID -- PROD
const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLESHEETID);

class NameForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        value: '', 
        location: props.location, 
        alimento: props.alimento, 
        isLoading:false,
        telefone:props.telefone,
        diaSemana:props.diaSemana,
        mes:props.mes,
        numero:props.numero,
        redesocial:props.redesocial,
      };
  
      // this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);


    }

  componentDidMount() {
      
    //salvar acesso  
      
    (async function main(self) {
      try{
        await doc.useServiceAccountAuth({
          client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
        });
    
        await doc.loadInfo(); // Loads document properties and worksheets
    
        const sheet = doc.sheetsByIndex[1];
        
        await sheet.loadCells('A2');
        const a1 = sheet.getCell(1, 0);
        a1.value+=1;
        await sheet.saveUpdatedCells();
      }catch(e){
        
      }
      
    })(this);

  }

    //ATUALIZAR PROPS VINDAS DO PAI
    static getDerivedStateFromProps(nextProps, state) {
      if(state){

        if (nextProps.alimento !== state.alimento){ 
          state.alimento=nextProps.alimento;
        }
        if (nextProps.telefone !== state.telefone){ 
          state.telefone=nextProps.telefone;
        }
        if (nextProps.diaSemana !== state.diaSemana){ 
          state.diaSemana=nextProps.diaSemana;
        }
        if (nextProps.horario !== state.horario){ 
          state.horario=nextProps.horario;
        }        
        if (nextProps.mes !== state.mes){ 
          state.mes=nextProps.mes;
        }
        if (nextProps.numero !== state.numero){ 
          state.numero=nextProps.numero;
        }
        if (nextProps.redesocial !== state.redesocial){ 
          state.redesocial=nextProps.redesocial;
        }
      }
      return state;
    }
  
    // handleChange(event) {
    //   this.setState({value: event.target.value});
    // }
  
    handleSubmit(event) { 
        //navigator.geolocation.getCurrentPosition(function(position) {
        if(this.state.location[0]===-8.0671132 && this.state.location[1]===-34.8766719){
          alert("Localização do celular está desativada, ative, recarregue a página e tente novamente com a localização ativa, se mesmo assim não conseguir insira o endereço completo e clique enviar endereço");
          event.preventDefault();
          return;
        }
        this.setState({isLoading: true});
            (async function main(self) {
                await doc.useServiceAccountAuth({
                    client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
                });
        
                await doc.loadInfo(); // Loads document properties and worksheets
                
                let regiao;
                if(envVariables.dentroLimites(self.state.location)){
                  regiao=0;
                }
                else{
                  alert("Região não suportada");
                  return;
                }
                const sheet = doc.sheetsByIndex[regiao];
                // const rows = await sheet.getRows();
                // Total row count

                // const row = { 
                //   Roaster: self.state.alimento, 
                //   URL:self.state.numero, 
                //   City: "", 
                //   Coordinates:JSON.stringify([self.props.location[0], self.props.location[1]]), 
                //   DateISO: new Date().toISOString(), 
                //   Telefone: self.props.telefone, 
                //   DiaSemana:self.props.diaSemana,
                //   Horario:self.props.horario,
                //   AlimentoEntregue:0,
                // };

                let dadosRow = {};
                dadosRow.alimento = self.state.alimento;
                dadosRow.numero = self.state.numero;
                dadosRow.endereco = "";
                dadosRow.coords = self.state.location;
                dadosRow.telefone = self.state.telefone;
                dadosRow.diaSemana = self.state.diaSemana;
                dadosRow.horario = self.state.horario;
                dadosRow.mes = self.state.mes;
                dadosRow.redesocial = self.state.redesocial;

              const row = envVariables.criarRow(dadosRow);

                
            // {
            //   Dados: JSON.stringify(
            //     { 
            //       "Roaster": self.state.alimento, 
            //       "URL":self.state.numero, 
            //       "City": "", 
            //       "Coordinates":JSON.stringify([self.props.location[0], self.props.location[1]]), 
            //       "DateISO": new Date().toISOString(), 
            //       "Telefone": self.props.telefone, 
            //       "DiaSemana":self.props.diaSemana,
            //       "Horario":self.props.horario,
            //       "AlimentoEntregue":0,
            //       "RedeSocial":self.state.redesocial.replace('@',''),
            //       "Avaliacao": {
            //         "1":0,
            //         "2":0,
            //         "3":0,
            //         "4":0,
            //         "5":0
            //       },
            //     }

            //   )
            // };
                
                const result = await sheet.addRow(row);
                //console.log(result);
                window.location.reload();
            })(this);
        //});
      event.preventDefault();
    }
  
    render() {
      return (
          this.state.isLoading ?
          <div><CircularProgress /></div>
          : 
            <button className="SubmitButton buttonsSidebySide" onClick={this.handleSubmit}>
              marcar Localização Atual
            </button>
        
      );
    }
  }
export default NameForm; 