const {httpClient} = require('server-infra/remote/httpReq')
const ndrConfig = require(`../shared/properties.json`)
console.log("NDR Config: ", ndrConfig)
const ckregexp = new RegExp('([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}')
const vgalbff = httpClient(ndrConfig.vgalBff.url, {}, { parser: JSON.parse, strictSSL: false });
const vgal = httpClient(`${ndrConfig.vgal.base}/${ndrConfig.vgal.modules.abstraction}`, {}, { parser: JSON.parse, strictSSL: false });


exports.getSensor = async (req, res) => {
    let gwck = req.params.gwck;
    if (!ckregexp.test(gwck)) {
      res.status(400).send('Invlid value for gw ck parameter');
    }
    
    // Ask for the gateway ck from vgal bff
    // pass x-cert-subjectdn and domain headers from this request
    let sensorResp = await vgalbff.send({
        url: `gateways/${gwck}`,
        headers: userHeaders(req)
    })
    
    console.log('sensorResp', sensorResp);

    // The vgal bff object is used to further authenticate that the user is allowed to access the sensor
    // but the sensor object does not contain the confidential fields snxIp and adminPassword, so they are fetched directly from vgal.
    let vgalResp = await vgal.send({
        url: `gateways/${gwck}`,
    })

    console.log('vgalResp', vgalResp);

    // Save the sensor response object on the request
    req.sensor = sensorResp

    // add the fields from vgal
    req.sensor.snxIp = vgalResp.snxIp
    req.sensor.adminPassword = vgalResp.adminPassword
    console.log('req.sensor', req.sensor);
    return req.sensor

  }