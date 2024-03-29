using UnityEngine;
using System.Collections;

public class ChargeState : BaseState
{

    private FragHore _fragHore;

    private double chargeTime = .0f;
    public ChargeState(FragHore frag)
    {
        _fragHore = frag;
        chargeTime = .0f;
        _fragHore.fragAnim.SetTrigger("power");
        _fragHore.fragAnim.SetBool("standing", false);
        Debug.Log("------------------------Heroine in ChargeState~!(��������״̬��)");
    }

    public void Update()
    {
       
    }

    public void HandleInput()
    {
        chargeTime += Time.deltaTime;
        if (Input.GetKeyUp(KeyCode.Space))
        {
            _fragHore.SetHeroineState(new JumpingState(_fragHore , chargeTime));
            chargeTime = .0f;
        }
    }
}