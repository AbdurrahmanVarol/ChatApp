using ChatApp_BE.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp_BE.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GendersController(IGenderService genderService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetGendersAsync()
    {
        var genders = await genderService.GetGendersAsync();
        return Ok(genders);
    }
}
