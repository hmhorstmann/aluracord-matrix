// export default function PaginaDoChat() {
//     return (
//         <div>
//             Página do Chat
//         </div>
//     )
// }

import { Box, Text, TextField, Image, Button } from '@skynexui/components'
import React from 'react'
import appConfig from '../config.json'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'

// https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM3MDc0MSwiZXhwIjoxOTU4OTQ2NzQxfQ.xUh1V1LGFf_NO_qNoN4NPPTXoNXBPG0Dc2COzK_6bgc'
const SUPABASE_URL = 'https://gqklwzbemyznotwnfkur.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient 
        .from('tabelaSupabaseMensagens')
        // .on('INSERT', (oQueVeio) => {
        //     console.log('Houve uma nova msg', oQueVeio)
        .on('INSERT', (respostaTempoReal) => {
            adicionaMensagem(respostaTempoReal.new)
        })
        .subscribe()
}

export default function ChatPage() {
    // Sua lógica vai aqui
    const roteamento = useRouter()
    const usuarioLogado = roteamento.query.username
    // console.log('usuarioLogado', usuarioLogado)
    // console.log('roteamento.query', roteamento.query)
    const [mensagem, setMensagem] = React.useState('')
    const [listaDeMensagens, setListaDeMensagens] = React.useState([])

    // console.log(mensagem)
    /* 
    - Usuario digita no campo textarea
    - Aperta Enter para enviar
    - Tem que adicionar o texto na listagem
    
    // Dev
    - [x] Campo criado (para digitar)
    - [x] Vamos usar onChange e usaState (if se a tecla seja apertada para limpar a variavel)
    - [x] Lista de mensagens (useState tbm)
    */

    React.useEffect(() => {
        supabaseClient
            .from('tabelaSupabaseMensagens')
            .select('*')
            .order('id', {ascending: false})
            // Sem destructuring
            // .then((dados) => {
            //     console.log('Dados da consulta:', dados)
            //     setListaDeMensagens(dados.data)

            // Com DESTRUCTURING
            .then(({ data }) => {
                // console.log('Dados da consulta:', data)
                setListaDeMensagens(data)
            })
        escutaMensagensEmTempoReal((novaMensagemSupabase) => {
            // console.log('nova mensagem supa:', novaMensagemSupabase)
            // Quero reutilizar um valor de referencia (objeto/array)
            // Passar uma função para o setState

            // setListaDeMensagens([
            //     novaMensagemSupabase,
            //     ...listaDeMensagens,
            // ])

            setListaDeMensagens((valorAtualDaLista) => {
                // console.log('lhuihdfauidhaDeMensagens', listaDeMensagens)

                return [
                    novaMensagemSupabase,
                    ...valorAtualDaLista,
                ]
            })
        })
    }, [])


    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            // id: listaDeMensagens.length + 1, //Agr vamos usar o id diretamente criado no servidor
            de: usuarioLogado,
            texto: novaMensagem,
        }

        // chamada back-end
        // setListaDeMensagens([
        //     mensagem,
        //     ...listaDeMensagens,
        // ])
        // setMensagem('')

        //chamada back-end com o Supabase...
        supabaseClient
            .from('tabelaSupabaseMensagens')
            .insert([
                // Tem que ser um objeto com os MESMOS CAMPOS no supabase e no codigo local
                mensagem
            ])
            .then(({ data }) => {
            //     // console.log('Ver a criacao de nova msg:', oQueTaVindoComoResposta) //arg da func .then((argFunc) => {})
            //     setListaDeMensagens([
            //         data[0],
            //         ...listaDeMensagens,
            //     ])
            })
        setMensagem('')
    }

    // ./Sua lógica vai aqui
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    {/* Ta mudando o valor {mensagem} */}

                    <MessageList
                        tagDeAtibutoDoComponente={listaDeMensagens} /> {/*  > OQ q tem AQUI DENTRO?????
                        <MessageList tagDeAtibutoDoComponente={[{}]} /> */}
                    {/* </MessageList> */}
                    {/* "tagDeAtibutoDoComponente" é o nome da tag que o
                    componente <MessageList /> recebe como argumento na chamada da função, ou seja,
                    a variavel na função recebe o OBJETO - ListaDeMensagens
                    */}


                    {/* escrevendo/imprimindo na tela */}
                    {/* passo a minha lista com objetos e transformo com o map 
                    para q apareca na tela com a tag <li> */}
                    {/* {listaDeMensagens.map((mensagemAtual) => {
                        console.log(mensagemAtual)
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
                    {/* escrevendo/imprimindo na tela */}

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                // console.log(event)
                                const valor = event.target.value
                                setMensagem(valor)
                            }}
                            onKeyPress={(event) => {
                                // console.log(event)
                                if (event.key === "Enter" && event.shiftKey === false) {
                                    event.preventDefault()
                                    handleNovaMensagem(mensagem)
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    // console.log(props)
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {/* Cada item da tagDeAtibutoDoComponente=[] que é igual a ListaDeMensagens=[], é um objeto={},
            aqui nomeado de abjetoAtualDoArrayDaListaDeMensagens={}, que nesse caso possui 3 chaves/valor:
            {de: , id: , texto: }                                                                     */}
            {props.tagDeAtibutoDoComponente.map((abjetoAtualDoArrayDaListaDeMensagens) => {
                return (
                    <Text
                        key={abjetoAtualDoArrayDaListaDeMensagens.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${abjetoAtualDoArrayDaListaDeMensagens.de}.png`}
                            />
                            <Text // área de texto para imprimir Remetente da msg
                                tag="strong"
                            >
                                {abjetoAtualDoArrayDaListaDeMensagens.de}
                            </Text>
                            <Text // área de texto para imprimir data e hora
                                tag="span"
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {abjetoAtualDoArrayDaListaDeMensagens.texto}
                    </Text>
                )
            })}
        </Box>
    )
}


// Observação.... 
/* 

Dentro de um componente, podemos obter seus "atributos/argumentos" para a função q criou o componente através
de props!!! Todas os "atributos" de "tag" (tag-html, por exemplo) de cada componente, são acessadas atraves de 
props.tag! 

Isso é o suficiente para fazer a "chamada" da função que cria esse componente. Já o conteúdo de texto 
pode ser acessado atraves de props.children!!! (Exemplo 2 - children so existe caso exista texto nessa area)
Exemplo: 
    <ComponenteReact tag="atributoDaTag" >
    props.tag é igual a "atributoDaTag"

Exemplo2: (children só existe nesse caso)
    <ComponenteReact > Esse conteúdo de texto é acessado pelo CHILDREN "props.children" </ComponenteReact>
    props.children é igual a 'Esse conteúdo de texto é acessado pelo CHILDREN "props.children"'

Os atributos de cada componente, são acessados pelo valor do atributo

*/