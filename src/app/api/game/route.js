import axios from 'axios';
import { NextResponse } from 'next/server';

const domain = "https://game-pass-ljbn.onrender.com/api/v1";

export async function POST(req) {
  try {
    const { actionType, ...data } = await req.json();

    console.log("data")
    console.log(data)
    console.log("data")

    switch (actionType) {
      case 'doesUserGameAccountExist':
        return await handleResponse(doesUserGameAccountExist(data));
      case 'initializeUserGameAccount':
        return await handleResponse(initializeUserGameAccount(data));
      case 'userGameAccountActions':
        return await handleResponse(userGameAccountActions(data));
      case 'sendTransactionInitializeUserGameAccount':
        return await handleResponse(sendTransactionInitializeUserGameAccount(data));
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }//
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { type, ...params } = Object.fromEntries(new URL(req.url).searchParams);

    switch (type) {
      case 'getSingleUserGameAccount':
        return await handleResponse(getSingleUserGameAccount(params));
      case 'getSingleGameAccount':
        return await handleResponse(getSingleGameAccount(params));
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


function removeAttributes(inputObject, attributesToRemove) {
    const result = { ...inputObject };
    attributesToRemove.forEach(attr => {
      delete result[attr];
    });
    return result;
}

function handleResponse(promise) {
  return promise
    .then(response => NextResponse.json(response.data))
    .catch(error => {
      console.error('Request error:', error);
      return NextResponse.json({ error: 'Error in request to external API' }, { status: 500 });
    });
}

async function doesUserGameAccountExist(data) {
    
  return axios.post(`${domain}/game/doesUserGameAccountExist`, data);

}

async function getSingleUserGameAccount(params) {
  return axios.get(`${domain}/game/getSingleUserGameAccount`, { params });
}

async function getSingleGameAccount(params) {
  return axios.get(`${domain}/game/getSingleGameAccount`, { params });
}

async function initializeUserGameAccount(data) {           
  return axios.post(`${domain}/game/getTrasaction`, data);
}

async function sendTransactionInitializeUserGameAccount(data) {
  return axios.post(`${domain}/game/initializeUserGameAccount`, data);
}

async function userGameAccountActions(data) {

  return axios.post(`${domain}/game/userGameAccountActions`, data);
}

