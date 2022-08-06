# 状态模式 state pattern

当我们实现一个角色的移动跳跃等操作时，往往需要庞大的判断或分支语句来区分玩家输入和动画状态。

而在我们完成某些状态的code后，可能需要加入新的特性如蓄力等，这时往往又需要修改之前的判断条件并加上一些蓄力时间等变量，修改起来牵一发而动全身

参考了[@毛星云 游戏设计模式（三） 状态模式、有限状态机](https://indienova.com/indie-game-development/game-programming-patterns-3/) 一文，实践了一下状态模式的来控制青蛙跳跃的功能

将角色的各种状态抽象成了状态类，各个状态类中实现各自的功能与状态切换，对庞大的判断逻辑解耦并且新加状态也更加轻松

[BaseState.cs](https://github.com/h87545645/Blog/blob/main/design-pattern/example-code/BaseState.cs)
定义状态接口
```
using UnityEngine;
using System.Collections;

public interface BaseState
{
    void Update();
    void HandleInput();

}
```

[StandingState.cs](https://github.com/h87545645/Blog/blob/main/design-pattern/example-code/StandingState.cs)
frag待机状态
```
using UnityEngine;
using System.Collections;

public class StandingState : BaseState
{
    private FragHore _fragHore;
    public StandingState(FragHore frag)
    {
        _fragHore = frag;
        _fragHore.fragAnim.SetBool("standing", true);
        Debug.Log("------------------------FragHore in StandingState~!（进入站立状态！）");
    }

    public void Update()
    {

    }

    public void HandleInput()
    {
        if (_fragHore.isGround)
        {
            if (Input.GetKeyDown(KeyCode.Space))
            {
                _fragHore.SetHeroineState(new ChargeState(_fragHore));
            }
        }
    }
}

```
[ChargeState.cs](https://github.com/h87545645/Blog/blob/main/design-pattern/example-code/ChargeState.cs)
frag 蓄力状态
```
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
        Debug.Log("------------------------FragHore in ChargeState~!(进入蓄力状态！)");
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
```


[JumpingState.cs](https://github.com/h87545645/Blog/blob/main/design-pattern/example-code/JumpingState.cs)
frag 跳跃
```
using UnityEngine;
using System.Collections;

public class JumpingState : BaseState
{

    private FragHore _fragHore;


    
    public JumpingState(FragHore frag, double chargeTime)
    {
        _fragHore = frag;
        _fragHore.fragAnim.SetTrigger("jump-up");
        _fragHore.fragAnim.SetBool("standing", false);
        float force = (float)(100 * chargeTime);
        _fragHore.heroRigidbody2D.AddForce(Vector2.up * force);
        Debug.Log("------------------------Heroine in JumpingState~!(进入跳跃状态！)");
    }

    public void Update()
    {

    }

    public void HandleInput()
    {
        if(_fragHore.isDrop && !_fragHore.fragAnim.GetBool("jump-down"))
        {
            _fragHore.fragAnim.SetTrigger("jump-down");
        }
        if (_fragHore.isDrop && _fragHore.isGround)
        {
            _fragHore.SetHeroineState(new StandingState(_fragHore));
        }
    }
}
```



[FragHore.cs]()
frag 类 实现青蛙的动画和判断青蛙当前的一些状态
```
   public SpriteRenderer heroRenderer;
    public Rigidbody2D heroRigidbody2D;
    public Animator fragAnim;

    [HideInInspector]
    public bool isGround = false;
    [HideInInspector]
    public bool isDrop = false;

    private double powerTime = 0.0f;

    BaseState _state;

    //public FragHore()
    //{
    //    _state = new StandingState(this);
    //    Debug.Log(_state);
    //}
    private void Awake()
    {
        _state = new StandingState(this);
    }

    public void SetHeroineState(BaseState newState)
    {
        _state = newState;
    }

    public void HandleInput()
    {

    }



    public void Update()
    {
        _state.HandleInput();
    }
```
