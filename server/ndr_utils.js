const { httpServer } = require('server-infra/remote/httpReq');
const { userHeaders } = require('server-infra/expressExt/user');
const { HttpError } = require('server-infra/utils/debug');
const ndrConfig = require(`../shared/properties.json`);
const ckregexp = new RegExp('([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}');
const vgalbff = httpServer(ndrConfig.vgalBff.url, {}, { parser: JSON.parse, strictSSL: false });
const vgal = httpServer(`${ndrConfig.vgal.base}/${ndrConfig.vgal.modules.abstraction}`, {}, { parser: JSON.parse, strictSSL: false });


exports.getSensor = async (req, res) => {
    let gwck = req.params.gwck;
    if (!ckregexp.test(gwck)) {
      throw new HttpError(400, 'Invlid value for gw ck parameter');
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
    return req.sensor

  }